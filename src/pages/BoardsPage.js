import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { UserOutlined, StarOutlined } from '@ant-design/icons';
import { withAuthorization } from '../auth/auth-hoc';
import { BoardTitle } from '../components/BoardTitle';
import { BoardModal } from '../components/BoardModal';
import { BoardsPageSkeleton } from '../components/BoardsPageSkeleton';
import { conferenceService } from '../application/services/conference';

export const BoardsPage = withAuthorization((authUser) => !!authUser)(() => {
    const [boards, setBoards] = useState({});
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    useEffect(() => {
        setLoading(true);
        (async () => {
            await fetchBoards();
        })();
    }, []);

    const fetchBoards = async () => {
        await conferenceService.conferences().on('value', (snapshot) => {
            if (!snapshot) {
                return;
            }
            setBoards(objectToArray(snapshot.val() || {}));
            setLoading(false);
        });
    };

    const objectToArray = (data) =>
        !data
            ? []
            : Object.values(data).map((value, index) => ({
                  ...value,
                  key: Object.keys(data)[index],
              }));

    if (loading) {
        return <BoardsPageSkeleton count={4} />;
    }

    return (
        <div className={`pt-16 py-4 px-3`}>
            <div className="flex mb-3 items-center text-xl">
                <UserOutlined className={`mr-2`} /> Available Conference
            </div>

            <div className="grid grid-cols-4 gap-4">
                {boards.map((board) => (
                    <BoardTitle
                        key={board?.key}
                        handleBoardClick={() => history.push(`conferences/${board?.key}`)}
                        board={board}
                    />
                ))}
            </div>
        </div>
    );
});
