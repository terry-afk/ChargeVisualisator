import React, { useEffect, useState } from 'react'

import { Row, Col, Typography, TreeSelect, Select } from "antd"
import { useGetDataQuery } from '../services/chargeApi'

const { TreeNode } = TreeSelect
const { Option } = Select

const Charge = () => {

  const [filter, setFilter] = useState(undefined)
  const [visual, setVisual] = useState("Charge/Capacite")
  const [data, setData] = useState(undefined)

  const { data: dataset, isFetching } = useGetDataQuery()

  const tmpData = [
    {cid: 1, start: 700, end: 1900},
    {cid: 1, start: 700, end: 1900},
    {cid: 2, start: 700, end: 1700}
  ]

  useEffect(() => {
    const createShift = (name) => {
      let shift = {}
      const length = Object.keys(tmpData).length

      for (let i = 0; i < 2400; i += 15) {
        if (i % 100 > 45) {
          i += 25
          continue
        }
        if (name === 0) {
          shift[`${i.toString()}`] = 0
          continue
        }
        for (let y = 0; y < length; y++) {
          if (tmpData[y]['cid'] === name && (i >= tmpData[y]["start"] && i <= tmpData[y]["end"])) {
            shift[`${i.toString()}`] = 39000
            break;
          }
        }
      }
      return (shift)
    }

    const createData = () => {
      const length = Object.keys(dataset).length
      let tmpData = []

      for (let i = 0; i < length; i++) {
        if (tmpData.indexOf(dataset[i].cid) === -1) {
          tmpData[`${dataset[i].cid}`] = createShift(dataset[i].cid)
        }
        let charge = dataset[i].cid === 0 ? dataset[i].chrg * -1 : dataset[i].chrg;
        let j = parseInt(dataset[i].from)
        if (j % 100 !== 0 && j % 100 !== 15 && j % 100 !== 30 && j % 100 !== 45) {
          tmpData[`${dataset[i].cid}`][`${(j - ((j % 100) % 15)).toString()}`] -= charge > (j % 100) % 15 ? 15 : (15 - ((j % 100) % 15)) / 15
          charge -= 15 - ((j % 100) % 15)
          j += 15 - ((j % 100) % 15)
        }
        while (charge > 0) {
          tmpData[`${dataset[i].cid}`][`${j.toString()}`] -= charge > 15 ? 15 : charge
          charge -= charge > 15 ? 15 : charge
          j += (j % 100 >= 45) ? 55 : 15
        }
      }
      console.log(tmpData)
      setData(tmpData)
    }

    if (!isFetching) {
      var startTime = performance.now()
      createData()
      var endTime = performance.now()
      console.log(endTime - startTime)
    }
  }, [isFetching])

  return (
    <>
      <Row>
        <Col span={5}>
          <Select
            defaultValue={"Charge/Capacite"}
            value={visual}
            style={{width: "100%"}}
            loading={isFetching}
            onChange={(value) => setVisual(value)}
          >
            <Option value="Charge/Capacite">Charge / Capacité</Option>
            <Option value="Ressources">Ressources</Option>
            <Option value="Cheminenements">Cheminenements</Option>
            <Option value="Planning_employe">Planning employé</Option>
            <Option value="Tableau_des_emplois">Tableau des emplois</Option>
          </Select>
        </Col>
        <Col span={19}>
          <TreeSelect
            showSearch
            treeCheckable
            style={{width: "100%"}}
            value={filter}
            placeholder="Please select"
            allowClear
            onChange={(value) => setFilter(value)}
          >
            <TreeNode value={"Jours"} title={"Jours"}>
              <TreeNode value={"Lundi"} title={"Lundi"}/>
              <TreeNode value={"Mardi"} title={"Mardi"}/>
              <TreeNode value={"Mercredi"} title={"Mercredi"}/>
              <TreeNode value={"Jeudi"} title={"Jeudi"}/>
              <TreeNode value={"Vendredi"} title={"Vendredi"}/>
              <TreeNode value={"Samedi"} title={"Samedi"}/>
              <TreeNode value={"Dimanche"} title={"Dimanche"}/>
            </TreeNode>
            <TreeNode value={"Rôles"} title={"Rôles"}>
              <TreeNode value={"Infirmiers"} title={"Infirmiers"}/>
              <TreeNode value={"Lingères"} title={"Lingères"}/>
              <TreeNode value={"Accompagnateurs"} title={"Accompagnateurs"}/>
              <TreeNode value={"Bionettoyeurs"} title={"Bionettoyeurs"}/>
              <TreeNode value={"Servers"} title={"Servers"}/>
            </TreeNode>
            <TreeNode value={"Contrats"} title={"Contrats"}>
              <TreeNode value={"IDE"} title={"IDE"}/>
              <TreeNode value={"ASH"} title={"ASH"}/>
              <TreeNode value={"AS de jour"} title={"AS de jour"}/>
              <TreeNode value={"AS de nuit"} title={"AS de nuit"}/>
              <TreeNode value={"Lingère"} title={"Lingère"}/>
              <TreeNode value={"Serveur"} title={"Serveur"}/>
            </TreeNode>
          </TreeSelect>
        </Col>
        <Col span={16}>
          <div style={{width: "100%", height: "400px", backgroundColor: "blue"}}>
          </div>
        </Col>
        <Col span={8}>
          <div style={{width: "100%", height: "400px", backgroundColor: "red"}}>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default Charge