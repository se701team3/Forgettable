// // If you want to test Dialog, copy this whole file and paste it to replace src/App.tsx for testing.

// import React, {useState} from 'react';
// import logo from './logo.svg';
// import './App.css';
// import Dialog from './components/Dialog/Dialog.js';
// import { fileURLToPath } from 'url'

// function App() {
//   const [isDialogShow, setDialogShow] = useState(false);
//   return (
//     <div className='App'>
//       <header className='App-header'>
//         <img src={logo} className='App-logo' alt='logo' />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className='App-link'
//           href='https://github.com/se701team3/Forgettable.git'
//           target='_blank'
//           rel='noopener noreferrer'
//         >
//           Hello
//         </a>
//         <button
//           className='App-link'
//           onClick={() => {
//             setDialogShow(!isDialogShow);
//           }}
//         >
//           Open Dialog
//         </button>
//         {isDialogShow ? (
//           <Dialog
//             title={'Warning'}
//             desc={'Are you sure you want to delete this person? You cannot undo this action.'}
//             cancalEvent={() => {
//               setDialogShow(!isDialogShow);
//             }}
//             confirmEvent={() => {
//               setDialogShow(!isDialogShow);
//             }}
//           />
//         ) : null}
//       </header>
//     </div>
//   );
// }

// export default App;
