import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { withAuthorization } from '../auth/auth-hoc';
import { BoardSkeleton } from '../components/BoardSkeleton';
import { conferenceService } from '../application/services/conference';
import MDEditor from '@uiw/react-md-editor';
import { useStateValue } from '../application/state-provider';
import PaperSubmissionForm from '../components/PaperSubmissionForm';
import RegistrationForm from '../components/RegistrationForm';

export const BoardPage = withRouter(
    withAuthorization((authUser) => !!authUser)((props) => {
        const conferenceId = () => props.match?.params?.conference;

        const [board, setBoard] = useState({
            lanes: [],
        });
        const [loading, setLoading] = useState(false);
        const [state] = useStateValue();
        const { user } = state;

        useEffect(() => {
            (async () => {
                setLoading(true);
                await fetchBoard();
                setLoading(false);
            })();
        }, []);

        const fetchBoard = async () => {
            const data = (await conferenceService.getConference(conferenceId())).val();
            setBoard(data);
        };

        if (loading) {
            return <BoardSkeleton count={5} />;
        }
        return (
            <div className="pt-16 my-3 flex justify-between">
                <div className="w-1/4 px-5">
                    <RegistrationForm board={board} user={user} conferenceId={conferenceId} />
                </div>
                <div className="w-1/2 m-auto">
                    <div className="text-4xl mb-5">{board.title}</div>
                    <MDEditor.Markdown
                        source={board.postMd || ''}
                        style={{ whiteSpace: 'pre-wrap' }}
                    />
                </div>
                <div className="w-1/4 px-5">
                    <PaperSubmissionForm board={board} user={user} conferenceId={conferenceId} />
                </div>
            </div>
        );
    })
);
