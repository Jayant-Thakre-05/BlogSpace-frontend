import { useEffect, useState } from 'react';
import { getPosts } from '../api/postAPI';
import PostCard from '../components/PostCard';
import { toast } from 'react-toastify';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await getPosts();
        setPosts(data?.postsData || []);
      } catch (e) {
        toast.error(e?.response?.data?.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="container main">Loading...</div>;

  return (
    <div className="container main">
      <h1 className="section-title">Latest Posts</h1>
      <div className="grid posts-grid">
        {posts.map((p) => (
          <PostCard key={p._id} post={p} />
        ))}
      </div>
      {!posts.length && <div className="card" style={{marginTop:16}}>No posts yet.</div>}
    </div>
  );
}
