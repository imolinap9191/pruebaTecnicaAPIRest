import React, { useEffect, useState } from "react";
import "../styles/women.css";

const API_URL = "https://66a42d7a44aa63704583805f.mockapi.io/women/v1/Woman";

const WomenList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    id: "",
    name: "",
    lastName: "",
    nationality: "",
    bio: "",
    photo: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error fetching data");
      const result = await response.json();
      setData(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingItem) {
      await updateItem(form);
    } else {
      await createItem(form);
    }
    setForm({
      id: "",
      name: "",
      lastName: "",
      nationality: "",
      bio: "",
      photo: "",
    });
    setEditingItem(null);
    fetchData();
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditingItem(item.id);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      fetchData();
    } catch (error) {
      setError(error.message);
    }
  };

  const createItem = async (item) => {
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const updateItem = async (item) => {
    try {
      await fetch(`${API_URL}/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const filteredWomen = data.filter((woman) =>
    woman.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="title">
        <h1>Listado de Mujeres Notables</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <h2>{editingItem ? "Editar" : "Agregar"} Mujer Notable</h2>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre"
          required
        />
        <input
          type="text"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Apellido"
          required
        />
        <input
          type="text"
          name="nationality"
          value={form.nationality}
          onChange={handleChange}
          placeholder="Nacionalidad"
          required
        />
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="Biografía"
          required
        />
        <input
          type="url"
          name="photo"
          value={form.photo}
          onChange={handleChange}
          placeholder="URL Foto"
          required
        />
        <button type="submit">{editingItem ? "Actualizar" : "Agregar"}</button>
      </form>
      <input
        type="text"
        placeholder="Buscar por nombre"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredWomen.map((woman) => (
          <li key={woman.id}>
            <h2>
              {woman.name} {woman.lastName}
            </h2>
            <p>
              <strong>Nacionalidad:</strong> {woman.nationality}
            </p>
            <p>{woman.bio}</p>
            <img
              src={woman.photo}
              alt={`${woman.name} ${woman.lastName}`}
              style={{ width: "200px" }}
            />
            <button onClick={() => handleEdit(woman)}>Editar</button>
            <button onClick={() => handleDelete(woman.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default WomenList;