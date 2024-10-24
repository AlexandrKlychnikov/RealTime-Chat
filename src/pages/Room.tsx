import React, { useState, useEffect, FormEvent } from 'react';
import client, { databases } from '../lib/appwrite/config';
import { ID, Query } from 'appwrite';
import { appwriteConfig } from '../lib/appwrite/config';

const Room = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messageBody, setMessageBody] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const { databaseId, collectionIdMessages: collectionId } = appwriteConfig;

  async function getMessages() {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collectionIdMessages,
        [Query.orderDesc('$createdAt'), Query.limit(100)]
      );

      if (!response) throw Error;

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
      `databases.${databaseId}.collections.${collectionId}.documents`,
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

  let payload = {
    body: messageBody,
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let response = await databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      payload
    );

    setMessageBody('');
  };

  return (
    <main className='container'>
      <div className='room--container'>
        <form id='message-form' onSubmit={handleSubmit}>
          <div>
            <textarea
              required
              maxLength={250}
              placeholder='Say something...'
              onChange={(e) => {
                setMessageBody(e.target.value);
              }}
              value={messageBody}
            ></textarea>
          </div>

          <div className='send-btn__wrapper'>
            <input className='btn btn_secondary' type='submit' value='Send' />
          </div>
        </form>
        <div>
          {messages.map((message) => (
            <div key={message.$id} className={'message__wrapper'}>
              <div className='message__header'>
                <p>
                  {message?.username ? (
                    <span> {message?.username}</span>
                  ) : (
                    'Anonymous'
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
      </div>
    </main>
  );
};

export default Room;
