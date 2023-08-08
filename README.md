 react-hookless
==================

**react-hookless** is a new state management library. This is a quite unusual
and yet efficient usage of React.js' hooks.

In **react-hookless**, you can create a single object without restrictions
which React.js applications have to follow and the object can be accessed from
anywhere in your React.js application. The object survives re-renderings so
that you do not have to care for its life-cycle. The object persists until the
browser window closes.

In `react-hookless`, the object is called **a model object**.

And call `rerencder()` method when there are any components to be updated
because the components are built upon the fields of the model object; at
this point, the React components can be called as views.

[CodeSandbox](https://hgnctd.csb.app/)

In this way, you can build your React application as traditional pure
JavaScritp object and you can manually control when React renders the current
Virtual DOM tree into HTML DOM tree.

The definition of the object is not restricted by those restriction which is
defined by React.js. The object which you wrote and created in the application
survives renderings and persists until the browser window closes.

- No framework is required
- No more stale closure problem
- No more batch update problem
- No more fussy tricks to manage rendering triggers indirect way

You just have to call rerender() whenever you want to rerender.

## The Idea in Short ##

Define your business logic as a simple pure JavaScript object as:

`AppModel.js`

```javascript
export class AppModel {
  fooValue = 1;
  barValue = 1;
  foo() {
    this.fooValue++;
    this.rerender();
  }
  bar() {
    this.barValue--;
    this.rerender();
  }
  dependency = 0;
}
```

Then, bind the model object to your main component; in this example, your main
component is named as `AppView`.

`App.js`

```javascript
import { defineModelView } from "./react-hookless.js";
import { AppView } from "./AppView.js";
import { AppModel } from "./AppModel.js";
export const [App, useAppModel] = defineModelView(
  AppView,
  () => new AppModel()
);
```

Then, build your main component. Your object can be accessed with `useAppModel()` hook.

This is actually the only hook you have to use in this framework; other hooks
are hidden to the hook.

`AppView.js`

```javascript
import "./styles.css";
import { useAppModel } from "./App.js";

export function AppView() {
  const appModel = useAppModel();
  return (
    <div className="App">
      <h1>An Unusual and Yet Very Effective Usage of React.js</h1>
      <div onClick={() => appModel.foo()}>{appModel.fooValue}</div>
      <br />
      <div onClick={() => appModel.bar()}>{appModel.barValue}</div>
    </div>
  );
}
```

In case you worry about the life cycle of your object, I will mention that the
object you specified to `defineModelView()` function survives
re-renderings.


Then, render the application object.

```javascript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.js";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

## The Principle of React-Hookless ##

The module `react-hookless` is so small that the source code can be exhibited
in the `README.md` of itsown.

The specified object becomes persistent by using `useRef()` hook and
the instance is shared by `useContext()` hook.

```javascript
import { useState, useRef, createContext, useContext } from "react";

function useRerender() {
  const [, setState] = useState(true);
  function rerender() {
    setState((e) => !e);
  }
  return rerender;
}

function usePersistentObject(factory, rerender) {
  const ref = useRef(null);
  if (ref.current === null) {
    ref.current = factory(rerender);
    ref.current.rerender = rerender;
  }
  return ref.current;
}

function definePersistentObject(ObjectConsumer, objectFactory) {
  const context = createContext();
  function ObjectProvider(props) {
    const rerender = useRerender();
    const persistentObject = usePersistentObject(objectFactory, rerender);
    return (
      <context.Provider value={persistentObject}>
        <ObjectConsumer />
      </context.Provider>
    );
  }
  function useObject() {
    return useContext(context);
  }
  return [ObjectProvider, useObject];
}

export function defineModelView(AppView, modelFactory) {
  return definePersistentObject(AppView, modelFactory);
}
```

## The API Reference ##
```javascript
import { defineModelView } from "./react-hookless.js";
export const [App, useAppModel] = defineModelView( AppView, appModelFactory );
```

- `AppView` : Specify the Main Component
- `appModelFactory` : A function which creates the model object


## Conclusion  ##

I am not sure this is an appropriate usage React.js nor I even don't think this
is a correct usage of React.js since this usage is a kind of an attempt of
denial of the React.js's mechanism for the automatic update detection.

But in this way, I believe, the number of issues which you often encounter when
you build a comparably larger application can be easily avoided.

I am worrying that nobody understand the meaning and the effectiveness of this
module because I even think this module is very weird; but it works.


Additionally, I am from Japan; my English ability is quite limited. Please
excuse my obscured English and I hope my English is good enough for everyone to
understand my idea.

Thank you very much and see you soon.


## History ##

- v1.0.0 Released
- v1.0.1 Updated README.md
- v1.0.2 Updated README.md (Tue, 08 Aug 2023 10:41:08 +0900)


