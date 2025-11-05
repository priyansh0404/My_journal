import { useEffect, useState } from "react";
import "../style/entries.css";
import { Link } from "react-router-dom";

function Entries() {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const [taskData, setTaskData] = useState([]);
  useEffect(() => {
    getListData();
  }, []);

  const getListData = async () => {
    let list = await fetch(`${API_URL}/entries`,{
      credentials:"include"  //isse backend me cookies store hojayega
    });
    const data = await list.json();
    if (data.success) {
      setTaskData(data.result);
    }
    else{
      alert("Try after sometime");
    }
  };

  const deleteTask = async(id) => {
    let data = await fetch(`${API_URL}/delete/` +id ,{method:'delete',credentials:"include"});
    data = await data.json();
    if(data.success){
        alert("Data successfully deleted");
        getListData();
    }
  }

  return (
    <>
      <h1>Journals</h1>

      <table className="entry-list" border="3">
        <thead>
          <tr>
            <th className="entry-header">S.No</th>
            <th className="entry-header">Date</th>
            <th className="entry-header">Title</th>
            <th className="entry-header">Description</th>
            <th className="entry-header">Action</th>
          </tr>
        </thead>
        <tbody>
          {taskData &&
            taskData.map((item, index) => (
              <tr key={item._id}>
                <td className="entry-item">{index + 1}</td>
                <td className="entry-item">{item.date}</td>
                <td className="entry-item">{item.title}</td>
                <td className="entry-item">{item.description}</td>
                <td className="entry">
                  <button className="delete-btn"onClick={() => deleteTask(item._id)}>Delete</button>
                  <Link className="update-btn" to={"/update/"+item._id}>Update</Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}
export default Entries;
