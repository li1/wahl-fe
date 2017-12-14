import React, {Component} from 'react';
import { withRouter } from 'react-router'

import Paper from 'material-ui/Paper';
import Card, { CardContent } from "material-ui/Card";
import Grid from 'material-ui/Grid';

import Typography from 'material-ui/Typography';
import EnhancedTable from '../components/TableExample';
import Spinner from "../components/Spinner";
import Button from "material-ui/Button";

let erststimmenselection = [];
let zweitstimmenselection = [];

export class Vote extends Component {

    constructor(props) {
        super(props);
        this.state = {tableData: [], tableDataParties: [], wahlkreis: -1, input: "", voted: false, invalidCode: false};
        this.btnTapped = this.btnTapped.bind(this);
        this.sendingVoteToBackend = this.sendingVoteToBackend.bind(this);
    }

    async setstatus(wahlkreis) {
        const kandidaten = await fetch("http://localhost:3000/wahlkreisdirektkandidaten/" + wahlkreis);
        const parteien = await fetch("http://localhost:3000/wahlkreisparteien/" + wahlkreis);
        const tableDataParties = await parteien.json();
        const tableData = await kandidaten.json();

        this.setState({tableData: tableData, tableDataParties: tableDataParties});

    }

    async btnTapped() {
        const {code} = this.state;
        const response = await fetch("http://localhost:3000/votingcode/" + code);
        const res = await response.json();
        console.log(res);
        if (res.status === 'OK') {
            this.setState({wahlkreis: res.WahlkreisID});
        }
        else (this.setState({invalidCode: true}));
        await this.setstatus(res.WahlkreisID);
    }

    handleStimmenAuswahl = (title, selection) => {
        if (title === "Erststimme")
            erststimmenselection = selection;
        else zweitstimmenselection = selection;
    }

    async sendingVoteToBackend() {
        const {code, voted} = this.state;

        if (!voted ) {
            var json = '{ "ErststimmenAuswahl": [' +
                erststimmenselection.map(kandidat => '"' + kandidat.kandidatid + '"').join(",") + '], "ZweitstimmenAuswahl" : [' +
                zweitstimmenselection.map(partei => '"' + partei.name + '"').join(",") + '], "code" : "' + code + '" }';
            const voteresult = fetch('http://localhost:3000/vote', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: json
            });

            this.setState({isVoting: true});
            const response = await (await voteresult).json();

            this.setState({isVoting: false});

            if (response.status === "OK") {
                this.setState({voted: true});
            } else {
                this.setState({voted: true});
                alert("Bei der Abgabe Ihrer Stimme ist ein Fehler aufgetreten. Bitte melden Sie sich beim Leiter Ihres Wahlbüros.");
                this.props.history.push("/overview")
            }
        }
    }

    handleChange = (votingcode) => {
        this.setState({code: votingcode.target.value});
    }

    render() {

        const {tableData, tableDataParties, wahlkreis, voted, invalidCode, isVoting} = this.state;

        if (isVoting || voted) {
            return (
                <Grid container spacing={24}>
                    <Grid item md={4} />
                    <Grid item xs={12} md={4}>
                        <div style={{paddingTop: 24, textAlign: "center"}}>
                            <Typography type="headline" component="h2">
                              Vielen Dank für die Abgabe Ihrer Stimme.
                            </Typography>
                            
                            {isVoting && 
                                <div>
                                    <Typography component="p">
                                      Ihre Stimmabgabe wird verarbeitet...
                                    </Typography>
                                    <Typography component="p">
                                        Sie können die Wahlkabine verlassen.
                                    </Typography>

                                    <Spinner />
                                </div>
                            }

                            { voted && 
                                <div>
                                    <Typography component="p">
                                      Ihre Stimme wurde erfolgreich übertragen.
                                    </Typography>
                                    <Typography component="p">
                                        Sie können die Wahlkabine verlassen.
                                    </Typography>

                                    <div style={{marginTop: 12}}>
                                      <Button raised color="primary" onClick={() => {this.props.history.push("/overview")}}>
                                        Zur Wahlübersicht
                                      </Button>
                                    </div>
                                </div>
                            }
                        </div>
                    </Grid>
                    <Grid item md={4} />
                </Grid>
            )
        }

        if (wahlkreis === -1) {
            return (
                <Grid container>
                  <Grid item xs={12} md={3}>
                    <Typography type="headline" component="h2">
                      Abstimmung
                    </Typography>
                    <Typography component="p">
                      Nach Angabe und Überprüfung Ihres Codes können Sie hier wählen.
                    </Typography>
                  </Grid>
                  <Grid item md={9} />
                  
                  <Grid item md={4} />
                  <Grid item xs={12} md={4}>
                      <Card>
                        <CardContent>
                          <Typography type="headline" component="h2" style={{ marginBottom: 24 }}>
                            Bitte geben Sie hier Ihren Code ein.
                          </Typography>
                          <div style={{textAlign: "center"}}>
                              <div>
                                <input type="text" style={{width: "80%"}} onChange={this.handleChange}/>
                              </div>
                              <div style={{marginTop: 12}}>
                                <Button raised color="primary" onClick={this.btnTapped}>Code überprüfen</Button>
                              </div>
                              <div style={{marginTop: 24}}>
                                {invalidCode ? 
                                <Typography style={{color: "#D32F2F"}} type="button" component="p">
                                  Ungültiger Code
                                </Typography>
                                :
                                " "}
                              </div>
                          </div>
                        </CardContent>
                      </Card>
                  </Grid>
                  <Grid item md={4} />
                </Grid>
            )
        }
        else return (
            <Grid container spacing={24}>
                <Grid item xs={12} md={3}>
                  <Typography type="headline" component="h2">
                    Sie wählen im Wahlkreis {wahlkreis}
                  </Typography>
                  <Typography component="p">
                    Sie haben 2 (zwei) Stimmen. Choose wisely!
                  </Typography>
                </Grid>
                <Grid item md={2} />
                <Grid item xs={12} md={2}>
                    <div style={{paddingTop: 6}}>
                        <Button raised color="accent" onClick={this.sendingVoteToBackend}>Wahl abschließen!</Button>
                    </div>
                </Grid>
                <Grid item md={5} />

                <Grid item xs={8} width="stretch">
                    <Paper>
                        {tableData !== undefined &&
                        <EnhancedTable data={tableData} title="Erststimme"
                                       onSelectionChange={this.handleStimmenAuswahl}/>}
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper>
                        <EnhancedTable data={tableDataParties} title="Zweitstimme"
                                       onSelectionChange={this.handleStimmenAuswahl}/>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}

export default withRouter(Vote);
