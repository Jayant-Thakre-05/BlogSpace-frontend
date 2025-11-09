import { useEffect, useState } from 'react';
import { getPostById, deletePost } from '../api/postAPI';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { formatDate } from '../utils/formatDate';
import { toast } from 'react-toastify';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getPostById(id);
        setPost(data?.postData || null);
      } catch (e) {
        toast.error(e?.response?.data?.message || 'Failed to load post');
      }
    };
    load();
  }, [id]);

  const canEdit = !!user && (
    post?.authorId === user?._id ||
    post?.author?._id === user?._id ||
    post?.userId === user?._id
  );

  const onDelete = async () => {
    try {
      await deletePost(id);
      toast.success('Post deleted');
      navigate('/');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Delete failed');
    }
  };

  if (!post) return <div className="container main">Loading...</div>;

  return (
    <div className="container main" style={{maxWidth:900}}>
      <article className="card">
        <h1 className="section-title" style={{marginBottom:6}}>{post.title}</h1>
        <p className="card-meta">{formatDate(post.createdAt)}</p>
        <div className="prose" style={{whiteSpace:'pre-wrap'}}>{post.content}</div>
        {canEdit && (
          <div className="card-actions" style={{marginTop:16}}>
            <Link className="btn" to={`/edit/${post._id}`}>Edit</Link>
            <button className="btn btn-danger" onClick={onDelete}>Delete</button>
          </div>
        )}
      </article>
    </div>
  );
}
