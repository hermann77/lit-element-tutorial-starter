import { LitElement, html } from "lit-element";
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-checkbox';
import '@vaadin/vaadin-radio-button';
import '@vaadin/vaadin-radio-button/vaadin-radio-group';
import {getVisibleTodosSelector, VisibilityFilters} from "../redux/reducer.js";
import {connect} from "pwa-helpers";
import {store} from "../redux/store.js";
import {addTodo, clearCompleted, updateFilter, updateTodoStatus} from "../redux/actions.js";

class TodoView extends connect(store)(LitElement) {

  static get properties() {
    return {
      todos: { type: Array },
      filter: { type: String },
      task: { type: String }
    };
  }


  stateChanged(state) {
    this.todos = getVisibleTodosSelector(state);
    this.filter = state.filter;
  }


  render() {
      // language=HTML format=false
        return html`
  <style>
  h1 {
  color: red;
  }
  </style>
  
      <h1>Todo App</h1>

          <div class="input-layout" @keyup="${this.shortcutListener}">
             <vaadin-text-field
                 placeholder="insert Task"
                 value="${this.task || ''}"
                 @change="${this.updateTask}"
             ></vaadin-text-field>
              <vaadin-button 
                theme="primary"
                @click="${this.addTodo}"
              >
              Add todo
              </vaadin-button>
          </div>
          
          <div class="todo-list">
            ${
            this.todos.map(todo => html`
            <div class="todo-item">
                <vaadin-checkbox 
                        ?checked="${todo.complete}"
                        @change="${e => this.updateTodoStatus(todo, e.target.checked)}">
                    <label slot="label">${todo.task}</label>
                </vaadin-checkbox>
            </div>`)
            }
          </div>
          
          <vaadin-radio-group @value-changed="${this._filterChanged}" label="Filter">
            ${Object.values(VisibilityFilters).map(f => html`
            <vaadin-radio-button value="${f}" label="${f}">
            </vaadin-radio-button>
            `)}
          </vaadin-radio-group>
          
          <vaadin-button @click="${this.clearCompleted}">
            Clear completed
          </vaadin-button>
          
          <p>Selected filter ${this.filter}</p>
          
      `;
   }


  clearCompleted() {
    store.dispatch(clearCompleted());
  }


   _filterChanged(e) {
      console.log('filter changed');
      console.log(e.target.value);

      store.dispatch(updateFilter(e.target.value));
   }


   updateTodoStatus(updatedTodo, complete) {
        store.dispatch(updateTodoStatus(updatedTodo, complete));
   }

   shortcutListener(e) {
        if (e.key === 'Enter'){
            this.addTodo();
        }
   }

    updateTask(e) {
        this.task = e.target.value;
    }


    addTodo() {
        console.log('Add todo');

        if (this.task) {
            store.dispatch(addTodo(this.task))
            this.task = '';
        }
    }

}

  customElements.define('todo-view', TodoView);