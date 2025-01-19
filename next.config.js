if (!apiKey) {
    setError('API key is not configured. Please set NEXT_PUBLIC_REPLICATE_API_KEY in your environment.');
    return;
  }