function Entries({children}) {
  return <div>
    <div className="prose" dangerouslySetInnerHTML={{ __html: children }}/>
  </div>;
}

export default Entries;
