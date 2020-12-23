import React, { useEffect, useState, useReducer } from "react";
import ReactDOM from "react-dom";


import "./styles.css";


const initialState = {
  fetched: false,
  todos: {}
};

const TODOS = {
  YOGA: {
    todo: "Do Yoga at 7:30 AM",
    isComplete: false
  },
  BREAKFAST: {
    todo: "Have breakfast at 8:30 AM",
    isComplete: false
  }
};

function reducer(state, action) {
  switch (action.type) {
    case "REPLACE_TODOS":
      return { ...state, fetched: true, todos: action.payload };
    case "UPDATE_TODOS": {
      return { ...state, todos: action.payload };
    }
    case "ADD_TODO":
      return {
        ...state,
        todos: {
          ...state.todos,
          ...action.payload
        }
      };
    case "COMPLETE_TODO":
      return {
        ...state,
        todos: {
          ...state.todos,
          [action.payload.id]: {
            ...state.todos[action.payload.id],
            isComplete: true
          }
        }
      };
    default:
      return state;
  }
}

function Loader() {
  return <div id="loader">Loading...</div>;
}

function Todos() {
  const [task, setTask] = useState("");
  const [state, dispatch] = useReducer(reducer, initialState);
  const { fetched, todos } = state;
  const keys = Object.keys(todos);

  useEffect(function () {
    function fetchData() {
      new Promise((resolve, reject) => {
        setTimeout(() => resolve(TODOS), 1000);
      }).then((response) => {
        // Updating state variable
        dispatch({
          type: "REPLACE_TODOS",
          payload: response
        });
      });
    }
    fetchData();
  }, []);

  function saveHandler(e) {
    e.preventDefault();
    dispatch({
      type: "ADD_TODO",
      payload: {
        [+new Date()]: {
          todo: task,
          isComplete: false
        }
      }
    });
    setTask("");
  }

  function controlHandler(id, operation) {
    switch (operation) {
      case "delete": {
        const clonedTodos = { ...todos };
        delete clonedTodos[id];
        dispatch({
          type: "UPDATE_TODOS",
          payload: clonedTodos
        });
        break;
      }
      default:
        console.log("This is odd.");
    }
  }

  function renderContent() {
    if (!fetched) {
      return <Loader />;
    }
    return (
      <ul id="todos">
        {keys.map((key) => {
          const value = todos[key];
          const { isComplete, todo } = value;
          return (
            <li key={key}>
              <p className={isComplete ? "complete" : ""}>{todo}</p>
              <button onClick={() => controlHandler(key, "delete")}>
                Delete Task
              </button>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="wrapper custom-scrollbar">
      <form method="#" onSubmit={saveHandler}>
        <input
          type="text"
          onChange={(e) => setTask(e.target.value)}
          value={task}
          placeholder="What needs to be done?"
        />
        <input type="submit" value="Add" title="Add Todo" />
      </form>
      {renderContent()}
    </div>
  );
}
const rootElement = document.getElementById("root");
ReactDOM.render(<Todos />, rootElement);
