import {CornerDownLeft, Eye, Trash} from 'react-feather';
import Button from './button';
import {useSocket} from '../hooks/useSocket';
import {useUser} from '../context/user';
import {useRouter} from 'next/router';
import {useState, useEffect} from 'react';
import supabase from '../utils/supabase';
interface Props {
  id: string;
  title: string;
  options: string;
  result: [];
  // eslint-disable-next-line no-unused-vars
  onDelete: (id: string) => void;
  onShowResult: () => void;
  onRestartVote: () => void;
}

const TopicItem = ({id, title, options, result, onDelete, onShowResult, onRestartVote}: Props) => {
  const {socket} = useSocket();
  const user = useUser();
  const router = useRouter();
  const roomId = (router.query.id as string)?.split('-').shift();
  const [responded, setResponded] = useState([{answer: '', name: ''}]);
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [choosen, setChoosen] = useState<string>('');

  useEffect(() => {
    const getAnswers = async () => {
      let {data: answers}: any = await supabase.from('answers').select('*').eq('topicId', id);
      setResponded(answers);
      setShouldFetch(false);
    };
    if (id) getAnswers();
  }, [id, shouldFetch]);

  const chooseOption = async (option: string) => {
    setChoosen(option);

    try {
      setIsLoading(true);
      await supabase.from('answers').delete().eq('user_id', user.id).eq('topicId', id);
      const {data} = await supabase.from('answers').insert([{answer: option, topicId: id, user_id: user.id, name: user.name}]);
      if (data) socket.emit('send_answer', {room: roomId});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    socket.on('receive_answer', (data) => {
      if (data.isRestart) {
        socket.emit('send_result', {room: roomId, topicId: id, isRestart: true});
        setChoosen('');
      }
      setShouldFetch(true);
    });
  }, [id, roomId, socket]);

  return (
    <div className="box-shadowed border-4 border-hfg-black rounded-lg p-4 md:p-6 bg-white w-full mt-8">
      <div className="flex flex-row items-center justify-between">
        <div>
          <span className="text-sm">Topic</span>
          <h3 className="room-name font-bold text-2xl capitalize">{title}</h3>
        </div>
        <div>
          <Button
            variant="black"
            size="small"
            className="mr-2 !border-none !shadow-none"
            onClick={() => {
              onDelete(id);
            }}
          >
            <Trash className="w-[16px] h-[16px]" />
          </Button>

          <Button variant="black" size="small" className="!border-none !shadow-none mr-2" onClick={() => onRestartVote()}>
            <CornerDownLeft className="w-[16px] h-[16px]" />
          </Button>
          <Button variant="secondary" size="small" className="!border-none !shadow-none" onClick={() => onShowResult()}>
            <Eye className="w-[16px] h-[16px]" />
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <span className="text-sm">Choose your answer: </span>
        <div className="flex flex-row justify-start mt-2">
          {options.split(',').map((option, index) => (
            <Button
              key={index}
              className={`mr-2 ${option === choosen ? 'bg-hfg-yellow' : ''}`}
              size="small"
              isLoading={option === choosen && isLoading}
              onClick={() => chooseOption(option)}
            >
              <span className="uppercase">{option}</span>
            </Button>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <span className="text-sm">People have voted: </span>
        <div className="flex flex-row justify-start mt-2">
          {responded
            ?.filter((item: any) => item.topicId == id)
            .map((item: {name: string}, index) => (
              <span key={index} className="mr-2">
                {item.name}
              </span>
            ))}
        </div>
      </div>

      {result
        ?.filter((item: any) => item.topicId == id)
        ?.map((item: any, index: number) => (
          <div key={index} className="mt-4 bg-hfg-black text-white p-4 rounded-lg">
            <div className="flex flex-col mb-4">
              <h4 className="capitalize">
                <span className="font-bold text-hfg-green">{item.answer}</span> : {item.name.length} people
              </h4>
              <div className="flex flex-row justify-start mt-2">
                {item.name.map((name: string, index: number) => (
                  <span className="p-2 text-xs bg-white text-hfg-black mr-1 rounded" key={index}>
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default TopicItem;
