import React from 'react';
import { SearchResultsLayoutProps } from './search-results-layout';

type NotFoundWord = SearchResultsLayoutProps['notFound'][number];

function WordCardMini(props: { word: NotFoundWord }) {
  return <div>not found {props.word}</div>;
}

export default WordCardMini;
