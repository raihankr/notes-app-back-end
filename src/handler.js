const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (req, h) => {
  const { title, tags, body } = req.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    id,
    createdAt,
    updatedAt,
    title,
    tags,
    body,
  };

  notes.push(newNote);

  const isSuccess = Boolean(notes.includes(newNote));

  if (isSuccess) {
    const res = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    res.code(201);
    return res;
  }

  const res = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  res.code(500);
  return res;
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: { notes },
});

const getNoteByIdHandler = (req, h) => {
  const { id } = req.params;

  const note = notes.filter((n) => n.id === id)[0];

  if (note) {
    return {
      status: 'success',
      data: { note },
    };
  }

  const res = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  res.code(404);
  return res;
};

const editNoteByIdHandler = (req, h) => {
  const { id } = req.params;
  const { title, tags, body } = req.payload;
  const updatedAt = new Date().toISOString();

  const note = notes.filter((n) => n.id === id)[0];
  if (note) {
    Object.assign(note, {
      title,
      body,
      tags,
      updatedAt,
    });

    const res = h.response({
      status: 'success',
      message: 'Catatam berhasil disimpan',
    });
    res.code(201);
    return res;
  }

  const res = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan, id tidak ditemukan',
  });
  res.code(404);
  return res;
};

const deleteNoteByIdHandler = (req, h) => {
  const { id } = req.params;
  const index = notes.findIndex((n) => n.id === id);

  if (index >= 0) {
    notes.splice(index, 1);
    const res = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    res.code(201);
    return res;
  }

  const res = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  res.code(404);
  return res;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
