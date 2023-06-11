import { useState } from 'react';
import { StarFilled, StarOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';

export const BoardTitle = ({ handleBoardClick, board }) => (
    <div
        role="button"
        onKeyDown={() => {}}
        tabIndex={-1}
        className={`h-32 rounded-md p-2 font-semibold flex flex-col bg-blue-500 text-white justify-between`}
        onClick={handleBoardClick}
    >
        <div className={'m-auto text-xl'}>{board.title}</div>
        <div className="flex justify-between items-center">
            <div>{moment(board.timeOccur || new Date()).format('DD-MM-yyyy, hh:mm')}</div>
            <div className="flex items-center gap-3">
                <div>{board.organizer.displayName}</div>
                <img
                    src={board.organizer.photoURL}
                    alt="organizer-avatar"
                    className="w-10 rounded-full"
                />
            </div>
        </div>
    </div>
);
BoardTitle.propTypes = {
    title: PropTypes.string.isRequired,
    addition: PropTypes.bool,
    handleBoardClick: PropTypes.func,
    handleBoardStarToggling: PropTypes.func,
    starred: PropTypes.bool,
    handleDeleteBoard: PropTypes.func,
};
