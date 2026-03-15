import express, { Request, Response } from 'express'
import cors from 'cors'
import { AddCommentBody, CommentResponse, CreatePostBody, LikePostBody, PostResponse } from './types';
import { Comment, Like, Post } from './sequelize';

const app = express();
app.use(cors())
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────

app.post('/posts', async (req: Request<{}, {}, CreatePostBody>, res: Response) => {
    const { login, text, image, avatar } = req.body;

    if (!login || !text) {
        res.status(400).json({ error: 'Login and text required' });
        return;
    }

    const post = await Post.create({
        author: login,
        avatar,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        text,
        imageBg: image?.bg ?? null,
        imageLabel: image?.label ?? null,
    });

    res.json(post);
});

app.get('/posts', async (req: Request, res: Response<PostResponse[]>) => {
    const { login } = req.query;

    const posts = await Post.findAll({
        include: [
            { model: Comment, as: 'comments' },
            { model: Like, as: 'likes_list' },
        ],
    });

    const formatted: PostResponse[] = posts.map(p => {
        const likesList = (p.likes_list ?? []) as Like[];
        const liked = login ? likesList.some(l => l.login === login) : false;

        return {
            id: p.id,
            author: p.author,
            avatar: p.avatar,
            color: p.color,
            time: p.createdAt.toISOString(),
            text: p.text,
            image: p.imageBg ? { bg: p.imageBg, label: p.imageLabel ?? '' } : null,
            likes: p.likes,
            liked,
            comments: (p.comments ?? []).map((c): CommentResponse => ({
                id: c.id,
                author: c.author,
                avatar: c.avatar,
                color: c.color,
                text: c.text,
            })),
        };
    });

    res.json(formatted);
});

// ─── POST /posts/:id/like ─────────────────────────────────────────────────────

app.post('/posts/:id/like', async (req: Request<{ id: string }, {}, LikePostBody>, res: Response) => {
    const { login } = req.body;
    const postId = req.params.id;

    if (!login) {
        res.status(400).json({ error: 'Login required' });
        return;
    }

    const post = await Post.findByPk(postId);
    if (!post) {
        res.status(404).json({ error: 'Post not found' });
        return;
    }

    // Если уже лайкнул — убираем лайк (toggle)
    const existing = await Like.findOne({ where: { login, PostId: postId } });

    if (existing) {
        await existing.destroy();
        await post.decrement('likes');
        await post.reload();
        res.json({ liked: false, likes: post.likes });
        return;
    }

    await Like.create({ login, PostId: postId });
    await post.increment('likes');
    await post.reload();

    res.json({ liked: true, likes: post.likes });
});


// ─── POST /posts/:id/comments ─────────────────────────────────────────────────

app.post('/posts/:id/comments', async (req: Request<{ id: string }, {}, AddCommentBody>, res: Response) => {
    const { login, text, avatar } = req.body;
    const postId = req.params.id;

    if (!login || !text) {
        res.status(400).json({ error: 'Login and text required' });
        return;
    }

    const post = await Post.findByPk(postId);
    if (!post) {
        res.status(404).json({ error: 'Post not found' });
        return;
    }

    const comment = await Comment.create({
        author: login,
        avatar,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        text,
        PostId: postId,
    });

    const response: CommentResponse = {
        id: comment.id,
        author: comment.author,
        avatar: comment.avatar,
        color: comment.color,
        text: comment.text,
    };

    res.status(201).json(response);
});

// ─── Start ────────────────────────────────────────────────────────────────────

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));