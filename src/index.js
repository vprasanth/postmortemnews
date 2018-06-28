import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

class PostmortemApp extends React.Component {
  state = {
    list: [],
    page: 0
  };

  componentDidMount() {
    this.fetch(0);
  }

  constructUrl(page) {
    if (!page) page = 0;
    const url = `https://hn.algolia.com/api/v1/search?query=postmortem&page=${page}`;
    return url;
  }

  fetch(page) {
    fetch(this.constructUrl(page))
      .then(res => {
        return res.json();
      })
      .then(data => {
        this.setState(prevState => {
          return {
            list: data.hits.map(post => {
              return (
                <div>
                  <a href={post.url}>{post.title}</a>
                  <span> - {post.created_at}</span>
                </div>
              );
            }),
            maxPage: data.nbPages,
            page
          };
        });
      })
      .catch(err => console.error(err));
  }

  nextPage = () => {
    this.fetch(this.state.page + 1);
  };

  prevPage = () => {
    this.fetch(this.state.page - 1);
  };

  render = () => {
    return (
      <div class="PostmortemApp">
        <h2>Postmortems</h2>
        <a href="https://xkcd.com/376/">
          <img alt="epoch fail" src="https://imgs.xkcd.com/comics/bug.png" />
        </a>
        <BasicList items={this.state.list} />
        {this.state.page > 0 && (
          <BasicButton do={this.prevPage} label="Prev page" />
        )}
        {this.state.maxPage > 1 && (
          <BasicButton do={this.nextPage} label="Next page" />
        )}
        <p>
          Page {this.state.page} of {this.state.maxPage}
        </p>
        <footer>
          <p>
            Search powered by{" "}
            <a href="https://hn.algolia.com/api">https://hn.algolia.com/api</a>
          </p>
          <p>
            This{" "}
            <span role="img" aria-label="crap">
              💩
            </span>{" "}
            is by <a href="https://github.com/vprasanth/postmortemnews">vprasanth.</a>
          </p>
        </footer>
      </div>
    );
  };
}

function BasicButton(props) {
  return <button onClick={props.do}>{props.label}</button>;
}

function BasicList(props) {
  const items = props.items.map((item, i) => <li key={i}>{item}</li>);
  return <ul>{items}</ul>;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<PostmortemApp />, rootElement);
