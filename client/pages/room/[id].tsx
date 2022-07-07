/* eslint-disable @next/next/no-img-element */
import {useEffect, useState} from 'react';
import Button from 'components/button';
import Modal from 'components/modal';
import TextField from 'components/textField';
import TopicItem from 'components/topicItem';
import {useRouter} from 'next/router';
import {Plus} from 'react-feather';
import {useSocket} from '../../hooks/useSocket';
import {useUser} from '../../context/user';
import supabase from '../../utils/supabase';
import protectedRoute from '../../utils/protected';
interface TopicInterface {
  id: string;
  title: string;
  options: string;
}

interface ParticipantInterface {
  avatar_url: string;
  name: string;
}

const RoomDetail = () => {
  const {socket} = useSocket();
  const user = useUser();
  const router = useRouter();
  const roomTitle = (router.query.id as string)?.split('-').pop();
  const roomId = (router.query.id as string)?.split('-').shift();

  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [title, setTitle] = useState<string>();
  const [options, setOptions] = useState<string>('');
  const [topics, setTopics] = useState([]);
  const [participants, setParticipants] = useState([]);

  const handleOptionsChange = (e: any) => {
    setOptions(e.target.value.toLowerCase());
  };

  useEffect(() => {
    socket.emit('join_room', {room: roomId, user});
  }, [socket, roomId, user]);

  useEffect(() => {
    socket.on('send_user_list', (data) => {
      setParticipants(data);
    });
    socket.on('receive_topic', () => {
      setShouldFetch(true);
    });
  }, [socket]);

  // useEffect(() => {
  //   socket.on('receive_answer', () => {
  //     setShouldFetch(true);
  //   });
  // }, [socket]);

  useEffect(() => {
    if (roomId) {
      const getTopics = async () => {
        let {data: topics}: any = await supabase.from('topics').select('*').eq('room-id', roomId);
        setTopics(topics);
      };
      getTopics();
    }
    setShouldFetch(false);
  }, [roomId, shouldFetch]);

  const createTopic = async () => {
    setOptions('');
    await supabase.from('topics').insert([
      {
        title,
        options,
        'room-id': roomId,
      },
    ]);
    setIsActive(false);
    setShouldFetch(true);

    socket.emit('send_topic', {room: roomId});
  };

  const deleteTopic = async (id: string) => {
    const {data} = await supabase.from('answers').delete().eq('topicId', id);
    if (data) await supabase.from('topics').delete().eq('id', id);

    socket.emit('send_topic', {room: roomId});
  };
  const revealVote = (id: string) => {
    socket.emit('send_result', {room: roomId, topicId: id});
  };
  const [result, setResults] = useState<[]>([]);

  useEffect(() => {
    socket.on('receive_result', (data) => {
      if (data.isRestart) {
        setResults([]);
        return;
      }
      const getResult = async () => {
        let {data: answers} = await supabase.from('answers').select('*').eq('topicId', data.topicId);

        let result: {
          answer: string;
          name: string;
        }[] = [];

        answers?.forEach((item) => {
          let existing = result.filter((v) => v.answer === item.answer);
          if (existing.length) {
            var existingIndex = result.indexOf(existing[0]);
            result[existingIndex].name = result[existingIndex].name.concat(item.name);
          } else {
            if (typeof item.name == 'string') item.name = [item.name];
            result.push(item);
          }
        });

        let sortedResult = result.sort((a, b) => b.name.length - a.name.length) as [];
        setResults(sortedResult);
      };
      getResult();
    });
  }, [socket]);

  const restartVote = async (id: string) => {
    await supabase.from('answers').delete().eq('topicId', id);
    setResults([]);
    socket.emit('send_answer', {room: roomId, isRestart: true});
  };
  return (
    <div className={`py-8 bg-hfg-green-medium min-h-[calc(100vh-188px)]`}>
      <div className="container">
        <div className="flex flex-row justify-between items-center">
          <h1 className="font-black text-3xl leading-none text-center text-hfg-yellow uppercase text-shadowed--thin">{roomTitle}</h1>
          <Button className="!border-none !shadow-none !flex flex-row" variant="black" size="small" onClick={() => setIsActive(true)}>
            <Plus className="mr-1 ml-0 w-[16px] h-[16px]" />
            CREATE TOPIC
          </Button>
        </div>
      </div>

      <div className="container pb-[100px]">
        <div className="flex flex-col">
          {topics.map((topic: TopicInterface, index) => {
            return (
              <TopicItem
                key={index}
                id={topic.id}
                title={topic.title}
                options={topic.options}
                result={result}
                onDelete={(id) => deleteTopic(id)}
                onShowResult={() => revealVote(topic.id)}
                onRestartVote={() => restartVote(topic.id)}
              />
            );
          })}
        </div>
      </div>
      <div className="fixed left-0 bottom-0 w-full p-4 bg-hfg-black text-white">
        <div className="container">
          <div className="flex flex-row items-center justify-center">
            {participants.map((participant: ParticipantInterface, index) => {
              return (
                <div key={index} className="flex flex-col items-center mx-2">
                  <img
                    src={participant.avatar_url}
                    alt="Picture of the author"
                    width="50"
                    height="50"
                    referrerPolicy="no-referrer"
                    className="rounded-full mr-2"
                  />
                  <h5 className="mt-2 text-xs">{participant.name}</h5>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {isActive && (
        <Modal
          isActive={setIsActive}
          title="Create Topic"
          footer={
            <div className="flex justify-center">
              <Button className="w-[160px]" variant="secondary" onClick={() => createTopic()}>
                Create
              </Button>
            </div>
          }
        >
          <div>
            <TextField id="topic-id" label="Topic Name" placeholder="Ex: Dinner menus" onChange={(e) => setTitle(e.target.value)} />
            <div className="mt-4">
              <TextField id="options-id" label="Options" placeholder="Options separated by comma" onChange={handleOptionsChange} />
            </div>
            {options && (
              <div className="flex mt-4">
                {options.split(',').map((option, index) => (
                  <label key={index} className="mr-2 px-4 py-2 border-2 border-hfg-black rounded text-white bg-hfg-blue-medium">
                    {option}
                  </label>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default protectedRoute(RoomDetail);
