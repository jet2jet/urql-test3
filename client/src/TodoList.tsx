import { memo, useEffect, useRef } from 'react';
import { gql, useQuery } from 'urql';

const TODOS_QUERY = gql`
  query Todos {
    todos {
      id
      title
      tags
    }
  }
`;

interface TodosQuery {
  todos: {
    id: string;
    title: string;
    tags: string[];
  }[];
}

const TODOS_DETAILED_QUERY = gql`
  query TodosDetailed {
    todos {
      id
      title
      tags
      description
    }
  }
`;

export interface TodoListProps {
  detailed?: boolean;
}

const TodoList = memo(function TodoList({ detailed = false }: TodoListProps) {
  const [result] = useQuery<TodosQuery>({
    query: detailed ? TODOS_DETAILED_QUERY : TODOS_QUERY,
  });
  const refRenderCount = useRef(0);

  const { data, fetching, error } = result;

  useEffect(() => {
    ++refRenderCount.current;
  }, [data?.todos]);

  return (
    <div>
      {fetching && <p>Loading...</p>}

      {error && <p>Oh no... {error.message}</p>}

      {data && (
        <>
          <p>Render count: {refRenderCount.current}</p>
          <ul>
            {data.todos.map((todo) => (
              <li key={todo.id}>
                {todo.title} (ID: {todo.id} / Tags: {todo.tags.join(',')})
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
});
export default TodoList;
