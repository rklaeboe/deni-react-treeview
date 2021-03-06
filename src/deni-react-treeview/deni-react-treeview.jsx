import React from 'react';
import './deni-react-treeview.scss'
import DeniReactTreeViewItem from '../deni-react-treeview-item/deni-react-treeview-item'
import treeviewHelper from './deni-react-treeview.helper'
import treeviewProps from './deni-react-treeview.props'
import treeviewApiFn from './deni-react-treeview.api'


class DeniReactTreeView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      theme: props.theme,
      expandAll: props.expandAll,
    };
    this.expandAllFinished = this.expandAllFinished.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { items } = this.props;
    if (prevProps.items !== items) {
      this.state.rootItem.children = items;
      //treeviewHelper.loadData.call(this, this.props.items);
    }
    if (prevState.rootItem !== this.state.rootItem && this.state.expandAll) {
      this.expandAllFinished();
    }
  }

  componentDidMount() {
    this.api = treeviewApiFn(this);
    treeviewHelper.setTheme(this, this.props.theme);
    treeviewHelper.loadingSetup(this);
  }

  expandAllFinished() {
    this.setState({ expandAll: false });
  }

  render() {
    let self = this;
    let domTreeviewItem = (<DeniReactTreeViewItem root={true} treeview={self} level={0} item={this.state.rootItem} />);
    let children = this.state.rootItem && this.state.rootItem.children;
    if (children && children.length === 0) {
      if (this.props.items && this.props.items.length > 0) {
        children = this.props.items;
      }
    }
    let className = 'deni-react-treeview-container unselectable ' + self.state.theme;
    if (this.props.className) {
      className += ' ' + this.props.className;
    }
    let hasItems = (children !== undefined && children.length > 0);
    if (this.state.loading && (!this.props.lazyLoad || !hasItems)) {
      className += ' loading';
    }
    let showComponent = hasItems && (!this.state.loading || this.props.lazyLoad);
    let style = this.props.style || undefined

    return (
      (showComponent) ? (
        <div ref={(elem) => this.container = elem} className={className} style={style} >
          {domTreeviewItem}
          {_createComponentsChildren(self, domTreeviewItem, 1, children, this.state.expandAll)}
        </div>
      ) : <div className={className}></div>
    )
  }

}

//DeniReactTreeView.propTypes = treeviewProps.propTypes;
DeniReactTreeView.defaultProps = treeviewProps.defaultProps;

function _createComponentsChildren(treeview, parent, level, children, expandAll = false) {
  if (expandAll) {
    children = children.map(c => {
      c.expanded = true;
      return c;
    });
  }
  return (
    <div>
      {
        (parent.props.item && parent.props.item.expanded && children && children.length) ?
          children.map(function (child) {
            let domTreeviewItem = <DeniReactTreeViewItem expandAll={expandAll} treeview={treeview} parent={parent} level={level} key={child.id} item={child} />;
            return (
              <div key={child.id}>
                {domTreeviewItem}
                {_createComponentsChildren(treeview, domTreeviewItem, level + 1, child.children)}
              </div>
            )
          })
          : undefined
      }
    </div>
  );
}

export default DeniReactTreeView;
