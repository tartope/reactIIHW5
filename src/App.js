// Manages all the different state (previous operand, current operand, and the operation that we have)
import { useReducer } from 'react';
import { DigitButton } from './DigitButton';
import { OperationButton } from './OperationButton';
import './styles.css';

// Create the actions for the calculator
export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

// Reducer parameters are: state, action (action is destructured into type, payload (there will be different types of actions and those actions will pass along parameters))
const reducer = (state, { type, payload })=>{
  // Use a switch statement
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      // Don't make any changes (don't add more 0s)
      if(payload.digit === "0" && state.currentOperand === "0") return state;
      // Don't make any changes (don't add more periods)
      if(payload.digit === "." && state.currentOperand.includes(".")) return state;

      // Return a new state object
      return {
        // Spread out current state
        ...state,
        // Replace current operand (or if null), and add digit to end of it
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
    case ACTIONS.CHOOSE_OPERATION:
      if(state.currentOperand == null && state.previousOperand == null) return state;
      if(state.currentOperand ==null){
        return{
          ...state,
          operation: payload.operation
        }
      }
      if(state.previousOperand ==null){
        return{
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }

      return{
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }
      if(state.currentOperand == null)return state;
      if(state.currentOperand.length === 1){
        return{
          ...state,
          currentOperand: null
        }
      }

      return{
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
        

    case ACTIONS.EVALUATE:
      if(state.operation == null || state.currentOperand == null || state.previousOperand == null) return state;

      return{
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }

    default:
  }
}

const evaluate = ({ currentOperand, previousOperand, operation})=>{
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if(isNaN(prev) || isNaN(current)) return "";
  let computation = "";
  switch(operation){
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
    
    default:
  }
  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

const formatOperand = (operand)=>{
  if(operand == null) return;
  const [integer, decimal] = operand.split('.');
  if(decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  // Takes in the reducer function and default state which is an empty object for now
  // State variable is destructured into 3 variables
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})

  return (
    <div className="calculator-grid">

      <div className='output'>
        {/* Below two lines are where state variables are put into the code */}
        <div className='previous-operand'>{formatOperand(previousOperand)} {operation}</div>
        <div className='current-operand'>{formatOperand(currentOperand)}</div>
      </div>

      <button className='span-two'onClick={()=> dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={()=> dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation='÷' dispatch={dispatch} />
      <DigitButton digit='1' dispatch={dispatch} />
      <DigitButton digit='2' dispatch={dispatch} />
      <DigitButton digit='3' dispatch={dispatch} />

      <OperationButton operation='*' dispatch={dispatch} />
      <DigitButton digit='4' dispatch={dispatch} />
      <DigitButton digit='5' dispatch={dispatch} />
      <DigitButton digit='6' dispatch={dispatch} />

      <OperationButton operation='+' dispatch={dispatch} />      
      <DigitButton digit='7' dispatch={dispatch} />
      <DigitButton digit='8' dispatch={dispatch} />
      <DigitButton digit='9' dispatch={dispatch} />

      <OperationButton operation='-' dispatch={dispatch} />      
      <DigitButton digit='.' dispatch={dispatch} />
      <DigitButton digit='0' dispatch={dispatch} /> 
     
      <button className='span-two' onClick={()=> dispatch({ type: ACTIONS.EVALUATE })}>=</button>      

    </div>
  );
}

export default App;
