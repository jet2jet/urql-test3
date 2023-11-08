import * as React from 'react';
import { Client, Provider, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';

import TodoList from './TodoList';
import TodoDetail from './TodoDetail';
import TodoTags from './TodoTags';

import * as schema from '../../schema.json';

const client = new Client({
  url: 'http://localhost:4000',
  exchanges: [
    cacheExchange({
      schema,
    }),
    fetchExchange,
  ],
});

function App() {
  const [id, setId] = React.useState<string | null>(null);
  const refInput = React.useRef<HTMLInputElement>(null);
  const onSubmit = React.useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (refInput.current == null) {
      return;
    }
    setId(refInput.current.value);
  }, []);

  return (
    <Provider value={client}>
      <section>
        <h2>List</h2>
        <TodoList />
      </section>
      <section>
        <h2>Detail</h2>
        <form onSubmit={onSubmit}>
          <p>
            ID: <input ref={refInput} type="text" />{' '}
            <input type="submit" value="Get" />
          </p>
        </form>
        <h3>Properties</h3>
        {id != null && <TodoDetail id={id} />}
        <h3>Tags</h3>
        {id != null && <TodoTags id={id} />}
      </section>
    </Provider>
  );
}

export default App;
