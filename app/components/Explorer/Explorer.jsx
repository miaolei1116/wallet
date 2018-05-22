import React from "react";
import {Link} from "react-router/es";
import Translate from "react-translate-component";
import Icon from "../Icon/Icon";

class ExplorerCard extends React.Component {
    constructor(){
        super();
        // console.log(this)
        this.state = {
            width:0,
            height:0
        }
    };

    componentDidMount(){
        this.setState(
            () => ({
                height:document.getElementsByClassName("browse-list")[0].offsetWidth
            })
        )
    };
    


    render () {
        var W = this.state.width;
        var H = this.state.height;
        return (
            /*<div className="grid-content">
                <div className="card">
                    {this.props.children}
                </div>
            </div>*/
            <div className="browse-list" style={{borderRadius:"50%",width:W,height:H,lineHeight:"180px"}}>
                <div className="" style={{width:"100%",height:"100%"}}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

class Explorer extends React.Component {

    render () {

        return (
            <div className="grid-block page-layout flex-start">
                <div className="grid-content" style={{paddingLeft:"15%"}}>
                    <ExplorerCard>
                        <Link to="explorer/blocks">
                            {/*<div>
                                <Icon name="blocks" size="5x" fillClass="fill-black"/>
                            </div>*/}
                            {/*<div className="card-divider text-center">
                                <Translate component="span" content="explorer.blocks.title"/>
                            </div>*/}
                            区块链
                        </Link>
                    </ExplorerCard>

                    <ExplorerCard>
                        <Link to="explorer/accounts">
                            {/*<div>
                                <Icon name="accounts" size="5x" fillClass="fill-black"/>
                            </div>*/}
                            {/*<div className="card-divider text-center">
                                <Translate component="span" content="explorer.accounts.title"/>
                            </div>*/}
                            账户
                        </Link>
                    </ExplorerCard>

                    <ExplorerCard>
                        <Link to="explorer/assets">
                            {/*<div>
                                <Icon name="assets" size="5x" fillClass="fill-black"/>
                            </div>*/}
                            {/*<div className="card-divider text-center">
                                <Translate component="span" content="explorer.assets.title"/>
                            </div>*/}
                            资产
                        </Link>
                    </ExplorerCard>
                    
                    <ExplorerCard>
                        <Link to="explorer/witnesses">
                            {/*<div>
                                <Icon name="witnesses" size="5x" fillClass="fill-black"/>
                            </div>*/}
                            {/*<div className="card-divider text-center">
                                <Translate component="span" content="explorer.witnesses.title"/>
                            </div>*/}
                            见证人
                        </Link>
                    </ExplorerCard>

                    <ExplorerCard>
                        <Link to="explorer/committee-members">
                            {/*<div>
                                <Icon name="committee_members" size="5x" fillClass="fill-black"/>
                            </div>*/}
                            {/*<div className="card-divider text-center">
                                <Translate component="span" content="explorer.committee_members.title"/>
                            </div>*/}
                            理事会
                        </Link>
                    </ExplorerCard>

                    <ExplorerCard>
                        <Link to="explorer/fees">
                            {/*<div>
                                <Icon name="fees" size="5x" fillClass="fill-black"/>
                            </div>*/}
                            {/*<div className="card-divider text-center">
                                <Translate component="span" content="fees.title"/>
                            </div>*/}
                            费率表
                        </Link>
                    </ExplorerCard>

                  {/*  <ExplorerCard>
                        <Link to="data-market">
                            <div>
                                <Icon name="markets" size="5x" fillClass="fill-black"/>
                            </div>
                            <div className="card-divider text-center">
                                <Translate component="span" content="data_market.title"/>
                            </div>
                        </Link>
                    </ExplorerCard>

                    <ExplorerCard>
                        <Link to="explorer/statistics">
                            <div>
                                <Icon name="statistics" size="5x" fillClass="fill-black"/>
                            </div>
                            <div className="card-divider text-center">
                                <Translate component="span" content="explorer.statistics.title"/>
                            </div>
                        </Link>
                    </ExplorerCard>*/}
                    {/*<ExplorerCard>
                            <Link to="blocks">
                                <div>
                                    <Icon name="proposals" size="5x" fillClass="fill-black"/>
                                </div>
                                <div className="card-divider text-center">
                                    <Translate component="span" content="explorer.proposals.title" />
                                </div>
                            </Link>
                        </ExplorerCard>*/}
                </div>

            </div>
        );
    }
}

export default Explorer;
