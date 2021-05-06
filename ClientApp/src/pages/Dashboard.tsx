import { useState, useEffect } from 'react';

import CTA from '../components/CTA'
import PageTitle from '../components/Typography/PageTitle'
import response from '../utils/demo/tableData'
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
} from '@windmill/react-ui'
import PersonCard from '../components/Cards/PersonCard';


function Dashboard() {
  const [page, setPage] = useState(1)
  const [data, setData] = useState<typeof response>([])

  // pagination setup
  const resultsPerPage = 10
  const totalResults = response.length

  // pagination change control
  function onPageChange(p:number) {
    setPage(p)
  }

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    setData(response.slice((page - 1) * resultsPerPage, page * resultsPerPage))
  }, [page])

  return (
    <>
      <PageTitle>Dashboard</PageTitle>

      <CTA />

      {/* <!-- Cards --> */}
      <div className="grid mb-8">
        <PersonCard
          index={1}
          isExpanded={false}
          data={{}}
          onClick={(num: number) => {}}
          colorCss="bg-red-600"
        />

        <PersonCard
          index={2}
          isExpanded={true}
          data={{}}
          onClick={(num: number) => {}}
          colorCss="bg-blue-600"
        />
        <PersonCard
          index={3}
          isExpanded={false}
          data={{ initials: "RV" }}
          onClick={(num: number) => {}}
          colorCss="bg-yellow-600"
        />
        <PersonCard
          index={3}
          isExpanded={false}
          data={{ initials: "RV" }}
          onClick={(num: number) => {}}
          colorCss="bg-green-600"
        />
      </div>

      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Client</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data.map((user, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Avatar
                      className="hidden mr-3 md:block"
                      src={user.avatar}
                      alt="User image"
                    />
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {user.job}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">$ {user.amount}</span>
                </TableCell>
                <TableCell>
                  <Badge type={user.status}>{user.status}</Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {new Date(user.date).toLocaleDateString()}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={onPageChange}
          />
        </TableFooter>
      </TableContainer>

      <PageTitle>Charts</PageTitle>
    </>
  );
}

export default Dashboard
