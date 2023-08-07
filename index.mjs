
import { useState, useRef, createContext, useContext } from "react";

function useRerender() {
  const [, setState] = useState(0);
  function rerender() {
    setState((e) => e + 1);
  }
  return rerender;
}

function useConstructUserClass(factory, rerender) {
  const ref = useRef(null);
  if (ref.current === null) {
    ref.current = factory(rerender);
    ref.current.rerender = rerender;
  }
  return ref.current;
}

export function definePersistentObject(UserComponent, factory) {
  const context = createContext();
  function UserClassProvider(props) {
    const rerender = useRerender();
    const userClass = useConstructUserClass(factory, rerender);
    return (
      <context.Provider value={userClass}>
        <UserComponent />
      </context.Provider>
    );
  }
  function useUserClass() {
    return useContext(context);
  }
  return [UserClassProvider, useUserClass];
}

