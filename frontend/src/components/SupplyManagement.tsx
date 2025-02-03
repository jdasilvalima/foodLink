import React, { useState } from 'react';
import { Supply, dummySupplies, supplyTypeColors } from '../models/Supply';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const SupplyManager: React.FC = () => {
  const [supplies, setSupplies] = useState<Supply[]>(dummySupplies);
  const [editingSupply, setEditingSupply] = useState<Supply | null>(null);
  const [isAddingSupply, setIsAddingSupply] = useState(false);
  const [newSupply, setNewSupply] = useState<Partial<Supply>>({});

  const addSupply = () => {
    if (newSupply.number && newSupply.name) {
      setSupplies([
        ...supplies,
        {
          ...newSupply,
          id: supplies.length + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Supply,
      ]);
      setNewSupply({});
      setIsAddingSupply(false);
    }
  };

  const updateSupply = () => {
    if (editingSupply) {
      setSupplies(
        supplies.map((s) =>
          s.id === editingSupply.id ? { ...editingSupply, updatedAt: new Date().toISOString() } : s
        )
      );
      setEditingSupply(null);
    }
  };

  const deleteSupply = (id: number) => {
    setSupplies(supplies.filter((s) => s.id !== id));
  };

  const SupplyForm: React.FC<{ supply: Partial<Supply>; onSave: () => void; onCancel: () => void }> = ({
    supply,
    onSave,
    onCancel,
  }) => (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <h2 className="text-xl font-semibold mb-4">{supply.id ? 'Edit Supply' : 'Add New Supply'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Number"
          value={supply.number || ''}
          onChange={(e) => setNewSupply({ ...supply, number: e.target.value })}
          className="border rounded-md p-2"
        />
        <input
          type="text"
          placeholder="Name"
          value={supply.name || ''}
          onChange={(e) => setNewSupply({ ...supply, name: e.target.value })}
          className="border rounded-md p-2"
        />
        <input
          type="text"
          placeholder="Unit Type"
          value={supply.unitType || ''}
          onChange={(e) => setNewSupply({ ...supply, unitType: e.target.value })}
          className="border rounded-md p-2"
        />
        <input
          type="number"
          placeholder="Units Per Package"
          value={supply.unitsPerPackage || ''}
          onChange={(e) => setNewSupply({ ...supply, unitsPerPackage: Number(e.target.value) })}
          className="border rounded-md p-2"
        />
        <select
          value={supply.type || ''}
          onChange={(e) => setNewSupply({ ...supply, type: e.target.value })}
          className="border rounded-md p-2"
        >
          <option value="">Select Type</option>
          <option value="raw_material">Raw Material</option>
          <option value="packaging">Packaging</option>
          <option value="finished_product">Finished Product</option>
        </select>
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <button onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
          Cancel
        </button>
        <button onClick={onSave} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Save
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Supply Manager</h1>

      {isAddingSupply ? (
        <SupplyForm
          supply={newSupply}
          onSave={addSupply}
          onCancel={() => {
            setIsAddingSupply(false);
            setNewSupply({});
          }}
        />
      ) : (
        <button
          onClick={() => setIsAddingSupply(true)}
          className="mb-4 flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Supply
        </button>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units/Package</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {supplies.map((supply) => (
              <tr key={supply.id}>
                <td className="px-6 py-4 whitespace-nowrap">{supply.number}</td>
                <td className="px-6 py-4 whitespace-nowrap">{supply.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{supply.unitType}</td>
                <td className="px-6 py-4 whitespace-nowrap">{supply.unitsPerPackage}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${supplyTypeColors[supply.type]}`}>
                    {supply.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setEditingSupply(supply)}
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteSupply(supply.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingSupply && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <SupplyForm
              supply={editingSupply}
              onSave={updateSupply}
              onCancel={() => setEditingSupply(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplyManager;