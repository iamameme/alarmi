export default (
    <Grid>
        <Col style={{ backgroundColor: '#eaf2ff', width: '70%' }}>
            <Badge>{content}</Badge>
            <Form>
                <Item picker>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="ios-arrow-down-outline" />}
                        style={{ width: undefined }}
                        placeholder="Select your SIM"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.selected2}
                        onValueChange={function (a) { return (a) }}
                    >
                        <Picker.Item label="Wallet" value="key0" />
                        <Picker.Item label="ATM Card" value="key1" />
                        <Picker.Item label="Debit Card" value="key2" />
                        <Picker.Item label="Credit Card" value="key3" />
                        <Picker.Item label="Net Banking" value="key4" />
                    </Picker>
                </Item>
            </Form>
            <List>
                <ListItem thumbnail>
                    <Left>
                        <Thumbnail square source={{ uri: 'https://i.imgur.com/sVYiR5C.jpg' }} />
                    </Left>
                    <Body>
                        <Text>Sankhadeep</Text>
                        <Text note numberOfLines={1}>Its time to build a difference . .</Text>
                    </Body>
                    <Right>
                        <Button transparent>
                            <Text>View</Text>
                        </Button>
                    </Right>
                </ListItem>
                <ListItem itemHeader first>
                    <Text>COMEDY</Text>
                </ListItem>
                <ListItem>
                    <Text>Simon Mignolet</Text>
                </ListItem>
                <Separator bordered>
                    <Text>NEE</Text>
                </Separator>
                <ListItem>
                    <Text>Dejan Lovren</Text>
                </ListItem>
            </List>
        </Col>
        <Col>
            <Row style={{ backgroundColor: 'rgb(182,292,88)' }}>
                <Spinner />
                <Button
                    onPress={() =>
                        Toast.show({
                            text: "Wrong password!",
                            buttonText: "Okay",
                            duration: 3000
                        })}
                >
                    <Text>Toast</Text>
                </Button>
            </Row>
            <Row style={{ backgroundColor: 'rgb(8,9,99)' }}>

            </Row>
        </Col>
    </Grid>
);