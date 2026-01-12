import { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Archive, Play, Pause } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';
import { ErrorBanner } from '../../components/common/ErrorBanner';

interface Quiz {
  id: number;
  title: string;
  description: string;
  status: 'DRAFT' | 'READY' | 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
  questionCount?: number;
}

interface CreateQuizRequest {
  title: string;
  description: string;
}

export default function QuizManagementPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [formData, setFormData] = useState<CreateQuizRequest>({
    title: '',
    description: '',
  });

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/quizzes', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to load quizzes');
      const data = await response.json();
      setQuizzes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async () => {
    if (!formData.title) {
      setError('Title is required');
      return;
    }

    try {
      const response = await fetch('/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create quiz');
      
      setShowCreateModal(false);
      setFormData({ title: '', description: '' });
      loadQuizzes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create quiz');
    }
  };

  const handleUpdateQuiz = async () => {
    if (!selectedQuiz || !formData.title) {
      setError('Title is required');
      return;
    }

    try {
      const response = await fetch(`/api/quizzes/${selectedQuiz.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update quiz');
      
      setShowEditModal(false);
      setSelectedQuiz(null);
      setFormData({ title: '', description: '' });
      loadQuizzes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quiz');
    }
  };

  const handleDeleteQuiz = async () => {
    if (!selectedQuiz) return;

    try {
      const response = await fetch(`/api/quizzes/${selectedQuiz.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete quiz');
      
      setShowDeleteConfirm(false);
      setSelectedQuiz(null);
      loadQuizzes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete quiz');
    }
  };

  const handleStateTransition = async (quizId: number, action: 'ready' | 'archive' | 'activate' | 'deactivate') => {
    try {
      const response = await fetch(`/api/quizzes/${quizId}/${action}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error(`Failed to ${action} quiz`);
      
      loadQuizzes();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${action} quiz`);
    }
  };

  const openEditModal = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setFormData({
      title: quiz.title,
      description: quiz.description,
    });
    setShowEditModal(true);
  };

  const openDeleteConfirm = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setShowDeleteConfirm(true);
  };

  const getStatusColor = (status: Quiz['status']) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'READY':
        return 'bg-blue-100 text-blue-800';
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'ARCHIVED':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Quiz Management</h1>
        </div>
        <Button 
          onClick={() => {
            setFormData({ title: '', description: '' });
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Quiz
        </Button>
      </div>

      {error && <ErrorBanner message={error} onClose={() => setError(null)} />}

      <div className="grid gap-4">
        {quizzes.map(quiz => (
          <div key={quiz.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(quiz.status)}`}>
                    {quiz.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{quiz.description}</p>
                <div className="text-xs text-gray-500">
                  Created {new Date(quiz.createdAt).toLocaleDateString()}
                  {quiz.questionCount !== undefined && ` • ${quiz.questionCount} questions`}
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                {/* Edit Button */}
                <button
                  onClick={() => openEditModal(quiz)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  title="Edit quiz"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                {/* State Transition Buttons */}
                {quiz.status === 'DRAFT' && (
                  <button
                    onClick={() => handleStateTransition(quiz.id, 'ready')}
                    className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                  >
                    Mark Ready
                  </button>
                )}

                {quiz.status === 'READY' && (
                  <button
                    onClick={() => handleStateTransition(quiz.id, 'activate')}
                    className="p-2 text-green-600 hover:bg-green-50 rounded"
                    title="Activate quiz"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                )}

                {quiz.status === 'ACTIVE' && (
                  <button
                    onClick={() => handleStateTransition(quiz.id, 'deactivate')}
                    className="p-2 text-orange-600 hover:bg-orange-50 rounded"
                    title="Deactivate quiz"
                  >
                    <Pause className="w-4 h-4" />
                  </button>
                )}

                {(quiz.status === 'READY' || quiz.status === 'ACTIVE') && (
                  <button
                    onClick={() => handleStateTransition(quiz.id, 'archive')}
                    className="p-2 text-amber-600 hover:bg-amber-50 rounded"
                    title="Archive quiz"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                )}

                {/* Delete Button */}
                <button
                  onClick={() => openDeleteConfirm(quiz)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  title="Delete quiz"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {quizzes.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No quizzes found. Create one to get started.
        </div>
      )}

      {/* Create Quiz Modal */}
      <Modal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Quiz"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter quiz title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter quiz description"
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleCreateQuiz}
              className="flex-1"
            >
              Create
            </Button>
            <Button 
              onClick={() => setShowCreateModal(false)}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Quiz Modal */}
      <Modal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Quiz"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleUpdateQuiz}
              className="flex-1"
            >
              Update
            </Button>
            <Button 
              onClick={() => setShowEditModal(false)}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Quiz"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete <strong>{selectedQuiz?.title}</strong>? 
            This will also delete all questions, teams, and submissions associated with this quiz.
          </p>
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleDeleteQuiz}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
            <Button 
              onClick={() => setShowDeleteConfirm(false)}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
