import React, { useState } from "react";
import { isEmptyText } from "../utils";
import { v4 as uuid } from "uuid";
import { Input, Button } from "antd";
import { registrationService } from "../application/services/registration";
import moment from "moment";

const RegistrationForm = ({ board, conferenceId }) => {
    const [name, setName] = useState("");
    const [title, setTitle] = useState("");
    const [email, setEmail] = useState("");
    const [organization, setOrganization] = useState("");
    const [phone, setPhone] = useState("");

    const resetForm = () => {
        setName("");
        setTitle("");
        setEmail("");
        setOrganization("");
        setPhone("");
    };

    const handleSubmit = async () => {
        try {
            await registrationService.addRegistration({
                id: uuid(),
                name,
                title,
                email,
                organization,
                phone,
                conferenceId: conferenceId(),
                time: new Date().toISOString(),
            });
            resetForm();
            alert(`Registration success, welcome ${name} to join the conference`);
        } catch (error) {
            resetForm();
            alert("Something went wrong, please try again");
        }
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
                    <label htmlFor="name">Name *</label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="rounded-lg"
                    ></Input>
                </div>

                <div className="mb-5">
                    <label htmlFor="email">Email *</label>
                    <Input
                        id="name"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="rounded-lg"
                        type="email"
                    ></Input>
                </div>

                <div className="mb-5">
                    <label htmlFor="phone">Phone</label>
                    <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="rounded-lg"
                        type="phone"
                    ></Input>
                </div>

                <div className="mb-5">
                    <label htmlFor="title">Title</label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="rounded-lg"
                    ></Input>
                </div>

                <div className="mb-5">
                    <label htmlFor="title">Organization</label>
                    <Input
                        id="organization"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        className="rounded-lg"
                    ></Input>
                </div>

                <Button
                    type="primary"
                    disabled={isEmptyText(name) || isEmptyText(email)}
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </form>
        </div>
    );
};

export default RegistrationForm;
