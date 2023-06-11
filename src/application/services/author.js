import { db } from './firebase';

const authors = () => db.ref('authors');

const author = (author) => authors().child(author);

const addAuthor = (author) => {
    const customChild = authors().child(author.id);
    if (customChild.id) {
        return;
    } else customChild.set(author);
};

const deleteAuthor = (key) => author(key).remove();

const updateAuthor = (key, data) => author(key).update(data);

export const authorService = {
    authors,
    author,
    addAuthor,
    deleteAuthor,
    updateAuthor,
};
