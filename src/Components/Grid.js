import React from "react";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import "../styles/styles.css";
import "../styles/example-styles.css";

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import News from "../Screens/News";
import Signals from "../Screens/Signals";
import Movers from "../Screens/Movers";
import Charts from "../Screens/Charts";


const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


const ResponsiveReactGridLayout = WidthProvider(Responsive);

class ToolBoxItem extends React.Component {
  render() {
    return (
      <div
        className="toolbox__items__item"
        onClick={this.props.onTakeItem.bind(undefined, this.props.item)}
      >
        {this.props.item.i}
      </div>
    );
  }
}
class ToolBox extends React.Component {
  render() {
    return (
      <div className="toolbox">
        <span className="toolbox__title">Toolbox</span>
        <div className="toolbox__items">
          {this.props.items.map(item => (
            <ToolBoxItem
              key={item.i}
              item={item}
              onTakeItem={this.props.onTakeItem}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default class ToolboxLayout extends React.Component {
  static defaultProps = {
    className: "layout",
    rowHeight: 30,
    onLayoutChange: function() {},
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    initialLayout: generateLayout()
  };

  state = {
    currentBreakpoint: "lg",
    compactType: "vertical",
    mounted: false,
    layouts: { lg: this.props.initialLayout },
    toolbox: { lg: [] }
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  generateDOM() {
    return _.map(this.state.layouts[this.state.currentBreakpoint], l => {
      return (
        <div key={l.i} className={l.static ? "static" : ""}>
          <div className="hide-button" onClick={this.onPutItem.bind(this, l)}>
            &times;
          </div>
          {l.static ? (
            <span
              className="text"
              title="This item is static and cannot be removed or resized."
            >
              Static - {l.i}
            </span>
          ) : l.i==="0" ? (
            <Signals />
          ): l.i==="1" ? ( <Movers /> ): l.i==="2" ? ( <News /> ): ( <Charts /> )} 
        
        </div>
      );
    });
  }

  onBreakpointChange = breakpoint => {
    this.setState(prevState => ({
      currentBreakpoint: breakpoint,
      toolbox: {
        ...prevState.toolbox,
        [breakpoint]:
          prevState.toolbox[breakpoint] ||
          prevState.toolbox[prevState.currentBreakpoint] ||
          []
      }
    }));
  };

  onCompactTypeChange = () => {
    const { compactType: oldCompactType } = this.state;
    const compactType =
      oldCompactType === "horizontal"
        ? "vertical"
        : oldCompactType === "vertical"
        ? null
        : "horizontal";
    this.setState({ compactType });
  };

  onTakeItem = item => {
    this.setState(prevState => ({
      toolbox: {
        ...prevState.toolbox,
        [prevState.currentBreakpoint]: prevState.toolbox[
          prevState.currentBreakpoint
        ].filter(({ i }) => i !== item.i)
      },
      layouts: {
        ...prevState.layouts,
        [prevState.currentBreakpoint]: [
          ...prevState.layouts[prevState.currentBreakpoint],
          item
        ]
      }
    }));
  };

  onPutItem = item => {
    this.setState(prevState => {
      return {
        toolbox: {
          ...prevState.toolbox,
          [prevState.currentBreakpoint]: [
            ...(prevState.toolbox[prevState.currentBreakpoint] || []),
            item
          ]
        },
        layouts: {
          ...prevState.layouts,
          [prevState.currentBreakpoint]: prevState.layouts[
            prevState.currentBreakpoint
          ].filter(({ i }) => i !== item.i)
        }
      };
    });
  };

  onLayoutChange = (layout, layouts) => {
    this.props.onLayoutChange(layout, layouts);
    this.setState({ layouts });
  };

  onNewLayout = () => {
    this.setState({
      layouts: { lg: generateLayout() }
    });
  };

  render() {
    return (
      <div>
        <div>
          Current Breakpoint: {this.state.currentBreakpoint} (
          {this.props.cols[this.state.currentBreakpoint]} columns)
        </div>
        <div>
          Compaction type:{" "}
          {_.capitalize(this.state.compactType) || "No Compaction"}
        </div>
        <button onClick={this.onNewLayout}>Generate New Layout</button>
        <button onClick={this.onCompactTypeChange}>
          Change Compaction Type
        </button>
        <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={4} md={1.5}>
          <Item> <ToolBox
          items={this.state.toolbox[this.state.currentBreakpoint] || []}
          onTakeItem={this.onTakeItem}
        /></Item>
        </Grid>
        <Grid item xs={6} md={10} >
          <Item>  
        <ResponsiveReactGridLayout
          {...this.props}
         layouts={this.state.layouts}
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
          // WidthProvider option
          measureBeforeMount={false}
          // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
          // and set `measureBeforeMount={true}`.
          useCSSTransforms={this.state.mounted}
          compactType={this.state.compactType}
          preventCollision={!this.state.compactType}
        >
          {this.generateDOM()}
        </ResponsiveReactGridLayout></Item>
        </Grid>
      </Grid>
    </Box>

      </div>
    );
  }
}

function generateLayout() {
  return _.map(_.range(0, 4), function(item, i) {
    if(i===0) {
      return {
        x: 0,
        y: 0,
        w: 6,
        h: 8,
        i: i.toString(),
        static: false
      }
    }
    if(i===1) {
      return {
        x: 0,
        y: 8,
        w: 6,
        h: 7,
        i: i.toString(),
        static: false
      }
    }
    if(i===2) {
      return {
        x: 6,
        y: 0,
        w: 6,
        h: 8,
        i: i.toString(),
        static: false
      }
    }
    if(i===3) {
      return {
        x: 6,
        y: 8,
        w: 6,
        h: 7,
        i: i.toString(),
        static: false
      }
    }
  });
}


//write generateLayout function with for loop 

