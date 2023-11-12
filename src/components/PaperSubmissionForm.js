import React, { useState } from "react";
import { isEmptyText } from "../utils";
import { v4 as uuid } from "uuid";
import { Input, Button } from "antd";
import { boardService } from "../application/services/board";
import moment from "moment";
import { convertUser } from "../utils/convertFromRaw";

const PaperSubmissionForm = ({ board, user, conferenceId }) => {
    const { TextArea } = Input;
    const [paperLink, setPaperLink] = useState("");
    const [paperNote, setPaperNote] = useState("");
    const [paperTitle, setPaperTitle] = useState("");

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

    return (
        <div className="sticky top-10 px-3">
            <div className="text-xl font-bold mb-3 sticky">
                Conference registration deadline:{" "}
                <span>
                    {board.deadlineSubmission
                        ? moment(board.deadlineSubmission).format("DD/MM/yyyy, hh:mm")
                        : "Not set yet"}
                </span>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label htmlFor="paper-title">Paper title *</label>
                    <Input
                        id="paper-title"
                        value={paperTitle}
                        onChange={(e) => setPaperTitle(e.target.value)}
                        className="rounded-lg"
                    ></Input>
                </div>
                <div className="mb-5">
                    <label htmlFor="paper-link">Paper link *</label>
                    <Input
                        id="paper-link"
                        value={paperLink}
                        onChange={(e) => setPaperLink(e.target.value)}
                        className="rounded-lg"
                    ></Input>
                </div>

                <div className="mb-5">
                    <label htmlFor="paper-note">Note/Description</label>
                    <TextArea
                        id="paper-note"
                        value={paperNote}
                        onChange={(e) => setPaperNote(e.target.value)}
                        className="rounded-lg"
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
    );
};

export default PaperSubmissionForm;
