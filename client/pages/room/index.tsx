import {Plus} from 'react-feather';
import Button from 'components/button';
import Modal from 'components/modal';
import RoomItem from 'components/roomItem';
import TextField from 'components/textField';
import {useEffect, useState} from 'react';
import protectedRoute from '../../utils/protected';
import supabase from '../../utils/supabase';
import {useUser} from '../../context/user';
interface RoomInterface {
  id: number;
  name: string;
  participant: number;
  theme: string;
}

let classBackground = ['orange', 'pink', 'blue', 'yellow'];

const Room = () => {
  const user = useUser();
  const [rooms, setRooms] = useState<[]>([]);
  const [room, setRoom] = useState<string>('');
  const [selectedRoomId, setSelectedRoomId] = useState<number>();
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);

  const [isCreateModalActive, setIsCreateModalActive] = useState<boolean>(false);
  const [isDeleteModalActive, setIsDeleteModalActive] = useState<boolean>(false);

  const [isDismissible, setIsDismissible] = useState<boolean>(true);

  useEffect(() => {
    const getRooms = async () => {
      try {
        let {data: rooms}: any = await supabase.from('rooms').select('*').eq('uid', user?.id);
        if (rooms.length) {
          setRooms(rooms);
          setIsCreateModalActive(false);
          setIsDismissible(true);
        } else {
          setIsCreateModalActive(true);
          setIsDismissible(false);
        }
      } finally {
        setShouldFetch(false);
      }
    };
    getRooms();
  }, [shouldFetch, user?.id]);

  const createRoom = async () => {
    try {
      const {data} = await supabase.from('rooms').insert([
        {
          name: room,
          participant: 1,
          uid: user.id,
        },
      ]);
      if (data) {
        setShouldFetch(true);
        setIsDismissible(true);
      }
    } catch (error) {
      if (error) setShouldFetch(false);
    } finally {
      setIsCreateModalActive(false);
    }
  };

  const onConfirmDeleteRoom = (id: number) => {
    setIsDeleteModalActive(true);
    setSelectedRoomId(id);
  };

  const onDeleteRoom = async () => {
    try {
      const {data} = await supabase.from('rooms').delete().eq('id', selectedRoomId);
      if (data) {
        await supabase.from('topics').delete().eq('room-id', selectedRoomId);
        setShouldFetch(true);
      }
    } catch (error) {
      if (error) setShouldFetch(false);
    } finally {
      setIsDeleteModalActive(false);
    }
  };

  return (
    <div className="py-8 bg-hfg-green min-h-[calc(100vh-82px)]">
      <div className="container">
        <Button
          className="!border-none !shadow-none !flex flex-row items-center"
          variant="black"
          size="small"
          onClick={() => setIsCreateModalActive(true)}
        >
          <Plus className="mr-1 ml-0 w-[16px] h-[16px]" />
          CREATE ROOM
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {rooms.map((room: RoomInterface, index) => {
            if (index < classBackground.length) {
              room.theme = classBackground[index];
              classBackground.push(classBackground[index]);
            }
            return (
              <RoomItem
                key={index}
                id={room.id}
                name={room.name}
                participant={room.participant}
                theme={room.theme}
                deleteRoom={(val) => onConfirmDeleteRoom(val)}
              />
            );
          })}
        </div>
      </div>

      {isCreateModalActive && (
        <Modal
          isActive={setIsCreateModalActive}
          title="Create Room"
          isDismissible={isDismissible}
          footer={
            <div className="flex justify-center">
              <Button className="w-[160px]" variant="secondary" onClick={() => createRoom()}>
                Create
              </Button>
            </div>
          }
        >
          <div>
            <TextField id="room-id" label="Room Name" placeholder="" onChange={(e) => setRoom(e.target.value)} />
          </div>
        </Modal>
      )}

      {isDeleteModalActive && (
        <Modal
          isActive={setIsDeleteModalActive}
          title="Delete Room"
          footer={
            <div className="flex justify-center">
              <Button className="w-[120px]" onClick={() => setIsDeleteModalActive(false)}>
                Cancel
              </Button>
              <Button className="w-[120px]" variant="secondary" onClick={() => onDeleteRoom()}>
                YES
              </Button>
            </div>
          }
        >
          <div>
            <h3 className="text-lg font-bold block text-center">Are you sure?</h3>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default protectedRoute(Room);
