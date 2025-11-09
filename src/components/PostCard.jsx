import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatDate';

export default function PostCard({ post }) {
  const preview = (post?.content || '').slice(0, 140) + ((post?.content || '').length > 140 ? '…' : '');
  return (
    <article className="card">
      <h3 className="card-title">
        <Link to={`/post/${post?._id}`}>{post?.title || 'Untitled'}</Link>
      </h3>
      <p className="card-meta">{formatDate(post?.createdAt)}</p>
      <p>{preview}</p>
      <div className="card-actions">
        <Link className="btn" to={`/post/${post?._id}`}>Read more</Link>
      </div>
    </article>
  );
}
