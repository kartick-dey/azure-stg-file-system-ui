import './App.css';
import FileDownloadButton from './components/FileDownloadButton';
import FileUpload from './components/FileUpload';

function App() {
    return (
        <div>
            <FileUpload />
            <FileDownloadButton />
        </div>
    );
}

export default App;
