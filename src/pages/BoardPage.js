import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import Board from 'react-trello';
import { withAuthorization } from '../auth/auth-hoc';
import { BoardSkeleton } from '../components/BoardSkeleton';
import { conferenceService } from '../application/services/conference';
import { boardService } from '../application/services/board';
import MDEditor from '@uiw/react-md-editor';
import moment from 'moment';
import { Input, Button } from 'antd';
import { v4 as uuid } from 'uuid';
import { useStateValue } from '../application/state-provider';
import { convertUser } from '../utils/convertFromRaw';

export const BoardPage = withRouter(
    withAuthorization((authUser) => !!authUser)((props) => {
        const { TextArea } = Input;
        const [board, setBoard] = useState({
            lanes: [],
        });
        const [loading, setLoading] = useState(false);
        const [paperLink, setPaperLink] = useState('');
        const [paperNote, setPaperNote] = useState('');
        const [paperTitle, setPaperTitle] = useState('');
        const [state, dispatch] = useStateValue();
        const { user } = state;
        console.log(user);

        useEffect(() => {
            (async () => {
                setLoading(true);
                await fetchBoard();
                setLoading(false);
            })();
        }, []);

        const isEmptyText = (text) => !text || !text.trim();

        const fetchBoard = async () => {
            const data = (await conferenceService.getConference(conferenceId())).val();
            setBoard(prepareBoard(data));
        };

        // Fill empty properties that are important for Board component
        const prepareBoard = (board) => ({
            ...board,
            // lanes: (board?.lanes || []).map((lane) => ({
            //     ...lane,
            //     cards: lane?.cards || [],
            // })),
        });

        const handleSubmit = async () => {
            await boardService.updateBoard(conferenceId(), {
                lanes: board.lanes.map((val, index) => {
                    if (index !== 0) return val;
                    else {
                        return {
                            ...val,
                            cards: (board.lanes[index]?.cards || []).concat([
                                {
                                    title: paperTitle,
                                    laneId: board.lanes[index].id,
                                    id: uuid(),
                                    description: paperNote,
                                    paperLink: paperLink,
                                    author: convertUser(user),
                                },
                            ]),
                        };
                    }
                }),
            });
        };

        const conferenceId = () => props.match?.params?.conference;

        if (loading) {
            return <BoardSkeleton count={5} />;
        }
        console.log(board);
        return (
            <div className="pt-16 my-3 flex justify-between">
                {/* <div>{board.title}</div>
                <div>{moment(board.timeOccur).format()}</div>
                <div>{board.location}</div> */}
                <div className="w-1/4"></div>
                <div className="w-1/2 m-auto">
                    <div className="text-4xl mb-5">{board.title}</div>
                    <MDEditor.Markdown
                        source={board.postMd || ''}
                        style={{ whiteSpace: 'pre-wrap' }}
                    />
                </div>
                <div className="w-1/4 px-5">
                    <div className="text-xl font-bold mb-3">
                        Paper submission deadline:{' '}
                        <span>
                            {board.deadlineSubmission
                                ? moment(board.deadlineSubmission).format('DD/MM/yyyy, hh:mm')
                                : 'Not set yet'}
                        </span>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label htmlFor="paper-title">Paper title *</label>
                            <Input
                                id="paper-title"
                                value={paperTitle}
                                onChange={(e) => setPaperTitle(e.target.value)}
                            ></Input>
                        </div>
                        <div className="mb-5">
                            <label htmlFor="paper-link">Paper link *</label>
                            <Input
                                id="paper-link"
                                value={paperLink}
                                onChange={(e) => setPaperLink(e.target.value)}
                            ></Input>
                        </div>

                        <div className="mb-5">
                            <label htmlFor="paper-note">Note/Description</label>
                            <TextArea
                                id="paper-note"
                                value={paperNote}
                                onChange={(e) => setPaperNote(e.target.value)}
                            ></TextArea>
                        </div>

                        <Button
                            type="primary"
                            disabled={isEmptyText(paperLink) || isEmptyText(paperTitle)}
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </form>
                </div>
            </div>
        );
    })
);
