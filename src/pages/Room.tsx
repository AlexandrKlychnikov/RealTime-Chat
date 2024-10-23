import React, { useState, useEffect } from 'react';
import client, { databases } from '../lib/appwrite/config';
import { Query } from 'appwrite';
import { appwriteConfig } from '../lib/appwrite/config';

const Room = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messageBody, setMessageBody] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  async function getMessages() {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collectionIdMessages,
        [Query.orderDesc('$createdAt'), Query.limit(100)]
      );

      if (!messages) throw Error;

      setMessages(response.documents);
      return true;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  useEffect(() => {
    getMessages();

    const unsubscribe = client.subscribe(
      `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.collectionIdMessages}.documents`,
      (response: any) => {
        if (
          response.events.includes(
            'databases.*.collections.*.documents.*.create'
          )
        ) {
          console.log('A MESSAGE WAS CREATED');
          setMessages((prevState) => [response.payload, ...prevState]);
        }
        if (
          response.events.includes(
            'databases.*.collections.*.documents.*.delete'
          )
        ) {
          console.log('A MESSAGE WAS DELETED!!!');
          setMessages((prevState) =>
            prevState.filter((message) => message.$id !== response.payload.$id)
          );
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      {messages.map((message) => (
        <div key={message.$id} className={'message__wrapper'}>
          <div className='message__header'>
            <p>
              {message?.username ? (
                <span> {message?.username}</span>
              ) : (
                'Anonymous user'
              )}

              <small className='message-timestamp'>
                {' '}
                {new Date(message.$createdAt).toLocaleString()}
              </small>
            </p>
          </div>
          <div className={'message__body'}>
            <span>{message.body}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Room;
