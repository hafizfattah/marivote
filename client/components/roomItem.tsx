import router from 'next/router';
import {Trash} from 'react-feather';
import Button from './button';
interface Props {
  id: number;
  name: string;
  participant: number;
  theme: string;
  // eslint-disable-next-line no-unused-vars
  deleteRoom: (id: number) => void;
}

const RoomItem = ({id, name, participant, theme, deleteRoom}: Props) => {
  return (
    <div className={`room-item box-shadowed border-4 border-hfg-black rounded-lg p-4 bg-hfg-${theme}-medium`}>
      <div className="flex flex-row items-center justify-between">
        <div>
          <span className="text-sm">Room</span>
          <h3 className="room-name font-bold text-xl capitalize">{name}</h3>
        </div>
        <div className="text-right">
          <span className="text-sm">Participant</span>
          <div className="flex flex-row justify-end items-center">
            <h3 className="room-name font-bold text-xl capitalize">{participant}</h3>
          </div>
        </div>
      </div>
      <div className="flex flex-row mt-4">
        <Button className="w-full" size="small" onClick={() => router.push(`room/${id}-${name}`)}>
          Enter Room
        </Button>
        <Button className="w-auto ml-4" variant="black" size="small" onClick={() => deleteRoom(id)}>
          <Trash className="w-[16px] h-[16px]" />
        </Button>
      </div>
    </div>
  );
};

export default RoomItem;
