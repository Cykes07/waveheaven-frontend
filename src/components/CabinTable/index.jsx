import React from "react";
import './style.css'
import { Home, Calendar, CreditCard, BarChart3, Settings, LogOut, User, SettingsIcon, Edit2, Trash2, Filter } from 'lucide-react';

export default function CabinTable({ cabins, onEdit, onDelete }){
    return(
    <div className="table-container">
      <table className="cabin-table">
        <thead>
          <tr>
            <th>#</th> 
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cabins.map((cabin, index) => (
            <tr key={cabin.id}>
              <td>{index + 1}</td> 
              <td>{cabin.id}</td>
              <td>{cabin.name}</td>
              <td>
                <div className="action-buttons">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => onEdit(cabin)}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => onDelete(cabin)} 
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}