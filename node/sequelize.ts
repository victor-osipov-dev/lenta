import { CreationOptional, DataTypes, HasManyGetAssociationsMixin, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import { v4 as uuidv4 } from 'uuid'

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logging: false,
});

// ─── Models ───────────────────────────────────────────────────────────────────

export class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
    declare id: CreationOptional<string>;
    declare author: string;
    declare avatar: string;
    declare color: string;
    declare text: string;
    declare imageBg: string | null;
    declare imageLabel: string | null;
    declare likes: CreationOptional<number>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare getComments: HasManyGetAssociationsMixin<Comment>;
    declare comments?: Comment[];
    declare likes_list?: Like[];
}

Post.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => uuidv4(),
    },
    author: DataTypes.STRING,
    avatar: DataTypes.STRING,
    color: DataTypes.STRING,
    text: DataTypes.TEXT,
    imageBg: DataTypes.STRING,
    imageLabel: DataTypes.STRING,
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
}, { sequelize, modelName: 'Post' });

export class Comment extends Model<InferAttributes<Comment>, InferCreationAttributes<Comment>> {
    declare id: CreationOptional<string>;
    declare author: string;
    declare avatar: string;
    declare color: string;
    declare text: string;
    declare PostId: CreationOptional<string>;
}

Comment.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => uuidv4(),
    },
    author: DataTypes.STRING,
    avatar: DataTypes.STRING,
    color: DataTypes.STRING,
    text: DataTypes.TEXT,
    PostId: DataTypes.STRING,
}, { sequelize, modelName: 'Comment' });


export class Like extends Model<InferAttributes<Like>, InferCreationAttributes<Like>> {
    declare id: CreationOptional<string>;
    declare login: string;
    declare PostId: string;
}

Like.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => uuidv4(),
    },
    login: DataTypes.STRING,
    PostId: DataTypes.STRING,
}, { sequelize, modelName: 'Like' });



Post.hasMany(Comment, { as: 'comments', foreignKey: 'PostId' });
Comment.belongsTo(Post, { foreignKey: 'PostId' });
Post.hasMany(Like, { as: 'likes_list', foreignKey: 'PostId' });
Like.belongsTo(Post, { foreignKey: 'PostId' });

await sequelize.sync({ force: false }); 

