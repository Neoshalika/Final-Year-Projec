package bit.project.server.dao;

import bit.project.server.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.time.LocalDate;
import java.util.List;

@RepositoryRestResource(exported=false)
public interface EmployeeDao extends JpaRepository<Employee, Integer>{
    @Query("select new Employee (e.id,e.code,e.nametitle,e.callingname,e.photo) from Employee e")
    Page<Employee> findAllBasic(PageRequest pageRequest);

    @Query("select new Employee (e.id,e.code,e.nametitle,e.callingname,e.photo) from Employee e where e.designation.id =:id")
    List<Employee> findAllByDesination(@Param("id") Integer id);

    @Query("select e from Employee e where e.designation.id =:id")
    List<Employee> findAllByDesinationForTaskAllocation(@Param("id") Integer id);

    Employee findByCode(String code);
    Employee findByNic(String nic);
    Employee findByMobile(String mobile);
    Employee findByEmail(String email);
    Employee findByEtfno(String etfno);

    @Query("select count(e) from Employee e where e.dorecruit>=:startdate and e.dorecruit<=:enddate")
    Long getEmployeeCountByRange(@Param("startdate") LocalDate startdate, @Param("enddate")LocalDate enddate);


}
