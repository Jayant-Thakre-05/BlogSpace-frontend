import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { createPost } from '../api/postAPI';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import SpellcheckHelper from '../components/SpellcheckHelper';
import { improveText } from '../api/aiAPI';
import { toast } from 'react-toastify';

export default function CreatePost() {
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [improving, setImproving] = useState(false);
  const [improvingTitle, setImprovingTitle] = useState(false);

  const onSubmit = async (values) => {
    try {
      await createPost({ ...values, authorId: user?._id });
      reset();
      navigate('/');
    } catch (e) {
    }
  };

  const title = watch('title', '');
  const content = watch('content', '');

  const handleImproveTitle = async () => {
    try {
      setImprovingTitle(true);
      const { improvedText } = await improveText(title || '');
      if (typeof improvedText === 'string' && improvedText.length > 0) {
        setValue('title', improvedText, { shouldDirty: true });
        toast.success('Title improved');
      } else {
        toast.info('No improvements suggested');
      }
    } catch (e) {
    } finally {
      setImprovingTitle(false);
    }
  };

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
      // error toasts handled by interceptor for network errors
    } finally {
      setImproving(false);
    }
  };

  return (
    <div className="container main" style={{maxWidth:800}}>
      <h1 className="section-title">Create Post</h1>
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="input-group">
            <input className="input-field" placeholder="Title" spellCheck={true} {...register('title', { required: true })} />
            <label className="input-label">Title</label>
          </div>
          <div className="ai-toolbar">
            <button type="button" className="btn btn-secondary" onClick={handleImproveTitle} disabled={improvingTitle}>
              {improvingTitle ? 'Improving…' : 'Improve Title with AI'}
            </button>
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
          <div className="ai-toolbar">
            <button type="button" className="btn btn-secondary" onClick={handleImproveContent} disabled={improving}>
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
            <button className="btn btn-primary" type="submit">Publish</button>
          </div>
        </form>
      </div>
    </div>
  );
}

