import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ArticleList from './components/ArticleList';
import ArticleDetail from './components/ArticleDetail';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
                <Routes>
                    <Route path="/" element={<ArticleList />} />
                    <Route path="/articles/:id" element={<ArticleDetail />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
