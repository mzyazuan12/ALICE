import React from 'react';
import { Triangle } from 'react-loader-spinner';

const TriangleLoader: React.FC = () => {
  return (
    <div>
      <Triangle
        visible={true}
        height="30"
        width="30"
        color="#FFFFFF"
        ariaLabel="triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default TriangleLoader;
