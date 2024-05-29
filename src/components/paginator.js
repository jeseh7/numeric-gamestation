import React from 'react';
import './paginator.css';

class PageSelector extends React.Component {
  render() {
    const { currentPage, maxPages, pageNumber, selectPage } = this.props;
    let classNames = "page-selector-container";

    if (pageNumber === currentPage) {
      classNames += " selected";
    } else if (
      pageNumber === 1 ||
      pageNumber === maxPages ||
      (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2) ||
      (pageNumber >= currentPage - 5 && pageNumber <= currentPage + 5)
    ) {
      classNames += "";
    } else if (
      pageNumber >= currentPage - 5 && pageNumber <= currentPage + 5
    ) {
      classNames += " minimized";
    } else {
      classNames = "hidden";
    }

    return (
      <div className={classNames} onClick={() => selectPage(pageNumber)}>
        {pageNumber}
      </div>
    );
  }
}

class PageChanger extends React.Component {
  renderArrow() {
    return this.props.role === "negative" ? (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        onClick={() => this.props.changePage(-1)}
      >
        <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"></path>
      </svg>
    ) : (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        onClick={() => this.props.changePage(1)}
      >
        <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"></path>
      </svg>
    );
  }

  render() {
    return <div className="page-changer-container">{this.renderArrow()}</div>;
  }
}

class Paginator extends React.Component {
  constructor(props) {
    super(props);
    this.changePage = this.changePage.bind(this);
    this.selectPage = this.selectPage.bind(this);
  }

  changePage(diff) {
    const { currentPage, maxPages, onPageChange } = this.props;
    const newPage = currentPage + diff;

    if (newPage >= 1 && newPage <= maxPages) {
      onPageChange(newPage);
    }
  }

  selectPage(num) {
    this.props.onPageChange(num);
  }

  renderPageNumbers() {
    const { currentPage, maxPages } = this.props;
    return Array.from({ length: maxPages }, (_, i) => (
      <PageSelector
        key={i + 1}
        currentPage={currentPage}
        maxPages={maxPages}
        pageNumber={i + 1}
        selectPage={this.selectPage}
      />
    ));
  }

  render() {
    return (
      <div className="paginator-container">
        <PageChanger role="negative" changePage={this.changePage} />
        {this.renderPageNumbers()}
        <PageChanger role="positive" changePage={this.changePage} />
      </div>
    );
  }
}

export default Paginator;
