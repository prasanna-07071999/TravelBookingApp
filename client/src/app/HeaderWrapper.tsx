'use client';

import React, { useState } from 'react';
import Header from '../components/Header';

export default function HeaderWrapper() {
  const [searchQuery, setSearchQuery] = useState('');

  return <Header searchQuery={searchQuery} onSearch={setSearchQuery} />;
}
