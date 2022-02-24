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

  useEffect(() => {
    const createData = () => {
      const length = Object.keys(dataset).length
      let tmpData = []
      let shift = {}

      for (let i = 700; i < 2100; i += 15) {
        if (i % 100 > 45) {
          i += 25
          continue
        }
        shift[`${i.toString()}`] = 0
      }
      for (let i = 0; i < length; i++) {
        if (tmpData.indexOf(dataset[i].role) === -1 && dataset[i].role !== "") {
          tmpData[`${dataset[i].role}`] = shift
        }
      }
      for (let i = 0; i < length; i++) {
        if (dataset[i].role === "Deficit")
          continue;
        let charge = dataset[i].chrg;
        let j = parseInt(dataset[i].from)
        console.log(tmpData)
        if (j % 100 !== 0 && j % 100 !== 15 && j % 100 !== 30 && j % 100 !== 45) {
          tmpData[`${dataset[i].role}`][`${(j - j % 100).toString()}`] = 15 - (j % 100)
          charge -= 15 - (j % 100)
          j += 15 - (j % 100)
        }
        while (charge > 0) {
          tmpData[`${dataset[i].role}`][`${j.toString()}`] = charge > 15 ? 15 : charge
          charge -= charge > 15 ? 15 : charge
          j += (j % 100 >= 45) ? 55 : 15
        }
      }
      console.log(tmpData)
      setData(tmpData)
    }

    if (!isFetching)
      createData()
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