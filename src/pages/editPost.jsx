import { useEffect } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { getPostById, updatePost } from '../api/postAPI';
import { useNavigate, useParams } from 'react-router-dom';
import SpellcheckHelper from '../components/SpellcheckHelper';
import { improveText } from '../api/aiAPI';
import { toast } from 'react-toastify';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const [improving, setImproving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getPostById(id);
        const post = data?.post || data;
        reset({ title: post?.title || '', content: post?.content || '' });
      } catch (e) {
      }
    };
    load();
  }, [id, reset]);

  const onSubmit = async (values) => {
    try {
      await updatePost(id, values);
      navigate(`/post/${id}`);
    } catch (e) {
    }
  };

  const title = watch('title', '');
  const content = watch('content', '');

  const handleImproveContent = async () => {
    try {
      setImproving(true);
      const { improvedText } = await improveText(content || '');
      if (typeof improvedText === 'string' && improvedText.length > 0) {
        setValue('content', improvedText, { shouldDirty: true });
        toast.success('Content improved');
      } else {
        toast.info('No improvements suggested');
      }
    } catch (e) {
    } finally {
      setImproving(false);
    }
  };

  return (
    <div className="container main" style={{maxWidth:800}}>
      <h1 className="section-title">Edit Post</h1>
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="input-group">
            <input className="input-field" placeholder="Title" spellCheck={true} {...register('title', { required: true })} />
            <label className="input-label">Title</label>
          </div>
          <SpellcheckHelper
            label="Title"
            value={title}
            onChangeValue={(v) => setValue('title', v, { shouldDirty: true })}
            showPreview={true}
          />
          <div className="input-group textarea">
            <textarea className="textarea-field" placeholder="Content" spellCheck={true} {...register('content', { required: true })} />
            <label className="input-label">Content</label>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '6px 0' }}>
            <button type="button" className="btn" onClick={handleImproveContent} disabled={improving}>
              {improving ? 'Improving…' : 'Improve My Text with AI'}
            </button>
          </div>
          <SpellcheckHelper
            label="Content"
            value={content}
            onChangeValue={(v) => setValue('content', v, { shouldDirty: true })}
            showPreview={true}
          />
          <div>
            <button className="btn btn-primary" type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

