package bit.project.server.dao;

import bit.project.server.entity.Attendance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.time.LocalDate;

@RepositoryRestResource(exported=false)
public interface AttendanceDao extends JpaRepository<Attendance, Integer>{
    @Query("select new Attendance (a.id,a.code,a.date) from Attendance a")
    Page<Attendance> findAllBasic(PageRequest pageRequest);

    Attendance findByCode(String code);

    @Query("select count(e) from Attendance e where e.date>=:startdate and e.date<=:enddate")
    Long getEmployeeCountByRange(@Param("startdate") LocalDate startdate, @Param("enddate")LocalDate enddate);
}