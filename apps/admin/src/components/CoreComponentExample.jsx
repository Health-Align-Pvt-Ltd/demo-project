// Example component showing how to use core UI components
import React, { useState } from 'react';
import { Button, Input, Card, Modal } from '../core/ui';

const CoreComponentExample = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleSave = () => {
    console.log('Saving:', inputValue);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Core Component Example</h2>
      
      <Card>
        <Card.Header>
          <Card.Title>Using Core UI Components</Card.Title>
          <Card.Description>
            This example demonstrates how to use the core UI components from the local core directory.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <Input
              label="Example Input"
              id="example-input"
              placeholder="Enter some text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            
            <div className="flex space-x-2">
              <Button onClick={() => setIsModalOpen(true)}>
                Open Modal
              </Button>
              <Button variant="secondary" onClick={() => setInputValue('')}>
                Clear
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to save this data?</p>
        </Modal.Content>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CoreComponentExample;