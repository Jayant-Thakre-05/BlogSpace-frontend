import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { axiosInstanceWithAuth } from '../api/axiosClient';
import PostCard from '../components/PostCard';
import { toast } from 'react-toastify';

export default function Profile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  const isOwn = user?._id === id;
  const displayUser = isOwn ? user : null;
  const initial = (displayUser?.name || 'U').charAt(0).toUpperCase();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axiosInstanceWithAuth.get(`/posts/user/${id}`);
        setPosts(data?.postsData || []);
      } catch (e) {
        toast.error(e?.response?.data?.message || 'Failed to load user posts');
      }
    };
    load();
  }, [id]);

  return (
    <div className="container main">
      <h1 className="section-title">{isOwn ? 'Your Profile' : 'User Profile'}</h1>
      <div className="card" style={{marginBottom:16, display:'flex', gap:16, alignItems:'center'}}>
        <div style={{
          width:64,height:64,borderRadius:'50%',
          background:'linear-gradient(180deg, var(--primary), var(--primary-600))',
          display:'flex',alignItems:'center',justifyContent:'center',
          fontWeight:800,fontSize:24
        }}>{initial}</div>
        <div>
          <p><strong>Name:</strong> {displayUser?.name || '—'}</p>
          <p><strong>Email:</strong> {displayUser?.email || '—'}</p>
        </div>
      </div>
      <h2 className="section-title" style={{fontSize:22}}>Posts</h2>
      <div className="grid posts-grid">
        {posts.map(p => <PostCard key={p._id} post={p} />)}
      </div>
      {!posts.length && <div className="card" style={{marginTop:16}}>No posts yet.</div>}
    </div>
  );
}
